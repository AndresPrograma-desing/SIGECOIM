import { Op, Sequelize } from 'sequelize';
import { sequelize, Comodato, Instrumento, Estudiante, Representante, Usuario, Devolucion } from '../models/index.js';
import { getConfigValor } from './configuracionController.js';
import { handleSequelizeError } from '../utils/sequelizeErrors.js';

const MAX_INSTRUMENTOS_POR_ESTUDIANTE = 1;

// Genera el correlativo de contrato COM-{año}-{secuencial} contando los
// comodatos ya registrados en el año en curso dentro de la misma transacción.
export const generarFolioContrato = async (transaction) => {
  const anioActual = new Date().getFullYear();
  const totalDelAnio = await Comodato.count({
    where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha_inicio')), anioActual),
    transaction,
  });
  const secuencial = String(totalDelAnio + 1).padStart(3, '0');
  return `COM-${anioActual}-${secuencial}`;
};

// Si un comodato ACTIVO ya pasó su fecha de devolución prevista, lo marca VENCIDO.
// No hay cron: la corrección se hace "perezosamente" cada vez que se listan comodatos.
const autocorregirVencidos = async (comodatos) => {
  const hoy = new Date().toISOString().slice(0, 10);
  for (const comodato of comodatos) {
    if (comodato.estado === 'ACTIVO' && comodato.fecha_devolucion_prevista < hoy) {
      await comodato.update({ estado: 'VENCIDO' });
    }
  }
};

// Listar todos los comodatos (admite filtros opcionales por query string:
// estudiante_id, instrumento_id, desde/hasta sobre fecha_devolucion_prevista, estado)
export const getComodatos = async (req, res) => {
  try {
    const { estudiante_id, instrumento_id, desde, hasta, estado } = req.query;

    const where = {};
    if (estudiante_id) where.estudiante_id = estudiante_id;
    if (instrumento_id) where.instrumento_id = instrumento_id;
    if (desde || hasta) {
      where.fecha_devolucion_prevista = {};
      if (desde) where.fecha_devolucion_prevista[Op.gte] = desde;
      if (hasta) where.fecha_devolucion_prevista[Op.lte] = hasta;
    }

    const comodatos = await Comodato.findAll({
      where,
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          include: [{ model: Representante, as: 'representante' }],
        },
        {
          model: Instrumento,
          as: 'instrumento',
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'rol'],
        },
        {
          model: Devolucion,
          as: 'devolucion',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }],
        },
      ],
      order: [['id', 'DESC']],
    });

    await autocorregirVencidos(comodatos);

    const resultado = estado ? comodatos.filter((c) => c.estado === estado) : comodatos;
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener comodatos:', error);
    res.status(500).json({ error: 'Error interno al obtener los comodatos' });
  }
};

// Listado de comodatos vencidos o por vencer dentro de los próximos `dias` días,
// con el teléfono del representante para facilitar la notificación.
// Si no se pasa ?dias explícito, usa el valor configurado por el administrador
// (Configuración > Días de anticipación de alertas), con 7 como último recurso.
export const getRepresentantesPorVencer = async (req, res) => {
  try {
    const diasConfigurados = await getConfigValor('dias_alerta_vencimiento');
    const dias = parseInt(req.query.dias, 10) || parseInt(diasConfigurados, 10) || 7;
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    const comodatos = await Comodato.findAll({
      where: {
        estado: { [Op.in]: ['ACTIVO', 'VENCIDO'] },
        fecha_devolucion_prevista: { [Op.lte]: limite.toISOString().slice(0, 10) },
      },
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          attributes: ['id', 'nombre', 'apellido'],
          include: [{ model: Representante, as: 'representante', attributes: ['id', 'nombre', 'apellido', 'telefono'] }],
        },
        { model: Instrumento, as: 'instrumento', attributes: ['id', 'nombre', 'codigo_inventario'] },
      ],
      order: [['fecha_devolucion_prevista', 'ASC']],
    });

    await autocorregirVencidos(comodatos);

    res.json(comodatos);
  } catch (error) {
    console.error('Error al obtener comodatos por vencer:', error);
    res.status(500).json({ error: 'Error interno al obtener los comodatos por vencer' });
  }
};

// Registrar un comodato (préstamo)
export const createComodato = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { folio_contrato, fecha_inicio, fecha_devolucion_prevista, estudiante_id, instrumento_id, usuario_id, condicion_inicial, observaciones_iniciales } = req.body;

    if (!folio_contrato || !fecha_devolucion_prevista || !estudiante_id || !instrumento_id) {
      await t.rollback();
      return res.status(400).json({ error: 'Correlativo, fecha prevista de devolución, estudiante e instrumento son requeridos.' });
    }

    // Validar duplicado de correlativo
    const existeFolio = await Comodato.findOne({ where: { folio_contrato } });
    if (existeFolio) {
      await t.rollback();
      return res.status(400).json({ error: 'El correlativo de contrato ya se encuentra registrado.' });
    }

    // Validar que el estudiante exista
    const estudiante = await Estudiante.findByPk(estudiante_id);
    if (!estudiante) {
      await t.rollback();
      return res.status(404).json({ error: 'El estudiante seleccionado no existe.' });
    }

    // Validar límite de préstamos activos simultáneos por estudiante
    const prestamosActivos = await Comodato.count({
      where: { estudiante_id, estado: 'ACTIVO' },
      transaction: t,
    });
    if (prestamosActivos >= MAX_INSTRUMENTOS_POR_ESTUDIANTE) {
      await t.rollback();
      return res.status(400).json({ error: `El estudiante ya alcanzó el límite de ${MAX_INSTRUMENTOS_POR_ESTUDIANTE} instrumento(s) en comodato activo.` });
    }

    // Validar y bloquear el instrumento para préstamo
    const instrumento = await Instrumento.findByPk(instrumento_id, { transaction: t });
    if (!instrumento) {
      await t.rollback();
      return res.status(404).json({ error: 'El instrumento seleccionado no existe.' });
    }

    if (instrumento.estado_disponibilidad !== 'DISPONIBLE') {
      await t.rollback();
      return res.status(400).json({ error: `El instrumento no está disponible para préstamo. Estado actual: ${instrumento.estado_disponibilidad}` });
    }

    if (instrumento.estado_conservacion === 'MALO') {
      await t.rollback();
      return res.status(400).json({ error: 'El instrumento requiere reparación y no puede ser asignado.' });
    }

    // Obtener el ID del usuario (administrador inicial o el proporcionado)
    let userRegisterId = usuario_id;
    if (!userRegisterId) {
      const defaultAdmin = await Usuario.findOne({ where: { email: 'admin@sigecoim.com' } });
      userRegisterId = defaultAdmin ? defaultAdmin.id : 1;
    }

    // Crear el comodato
    const nuevoComodato = await Comodato.create({
      folio_contrato,
      fecha_inicio: fecha_inicio || new Date(),
      fecha_devolucion_prevista,
      estudiante_id,
      instrumento_id,
      usuario_id: userRegisterId,
      estado: 'ACTIVO',
      condicion_inicial: condicion_inicial || instrumento.estado_conservacion,
      observaciones_iniciales: observaciones_iniciales || null,
    }, { transaction: t });

    // Cambiar estado del instrumento a PRESTADO
    await instrumento.update({
      estado_disponibilidad: 'PRESTADO',
    }, { transaction: t });

    await t.commit();
    res.status(201).json(nuevoComodato);
  } catch (error) {
    await t.rollback();
    console.error('Error al registrar comodato:', error);
    handleSequelizeError(error, res, 'Error interno al registrar el comodato');
  }
};

// Registrar devolución
export const registrarDevolucion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // ID del comodato
    const { estado_instrumento_recibido, observaciones, usuario_id } = req.body;

    if (!estado_instrumento_recibido) {
      await t.rollback();
      return res.status(400).json({ error: 'El estado del instrumento recibido es obligatorio.' });
    }

    // Validar el comodato
    const comodato = await Comodato.findByPk(id, {
      include: [{ model: Instrumento, as: 'instrumento' }],
      transaction: t,
    });

    if (!comodato) {
      await t.rollback();
      return res.status(404).json({ error: 'El comodato no existe.' });
    }

    if (comodato.estado !== 'ACTIVO') {
      await t.rollback();
      return res.status(400).json({ error: 'Este comodato ya ha sido finalizado o no está activo.' });
    }

    // Verificar si ya tiene devolución registrada (seguridad adicional)
    const devolucionExistente = await Devolucion.findOne({ where: { comodato_id: id } });
    if (devolucionExistente) {
      await t.rollback();
      return res.status(400).json({ error: 'Ya existe una devolución registrada para este comodato.' });
    }

    // Obtener usuario que procesa devolución
    let userReceiverId = usuario_id;
    if (!userReceiverId) {
      const defaultAdmin = await Usuario.findOne({ where: { email: 'admin@sigecoim.com' } });
      userReceiverId = defaultAdmin ? defaultAdmin.id : 1;
    }

    // Registrar la devolución
    const nuevaDevolucion = await Devolucion.create({
      comodato_id: comodato.id,
      fecha_devolucion: new Date(),
      estado_instrumento_recibido,
      observaciones,
      usuario_id: userReceiverId,
    }, { transaction: t });

    // Actualizar estado del comodato a FINALIZADO
    await comodato.update({
      estado: 'FINALIZADO',
    }, { transaction: t });

    // Actualizar el instrumento: disponible de nuevo y actualizar su estado de conservación
    if (comodato.instrumento) {
      await comodato.instrumento.update({
        estado_disponibilidad: 'DISPONIBLE',
        estado_conservacion: estado_instrumento_recibido, // Actualiza el estado físico real
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(nuevaDevolucion);
  } catch (error) {
    await t.rollback();
    console.error('Error al registrar devolución:', error);
    handleSequelizeError(error, res, 'Error interno al registrar la devolución');
  }
};

// Actualizar un comodato (Préstamo)
export const updateComodato = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { folio_contrato, fecha_inicio, fecha_devolucion_prevista, estudiante_id, instrumento_id } = req.body;

    const comodato = await Comodato.findByPk(id, { transaction: t });
    if (!comodato) {
      await t.rollback();
      return res.status(404).json({ error: 'El comodato no existe.' });
    }

    if (comodato.estado !== 'ACTIVO') {
      await t.rollback();
      return res.status(400).json({ error: 'Solo se pueden editar comodatos que se encuentren activos.' });
    }

    // Validar duplicado de correlativo si se está cambiando
    if (folio_contrato && folio_contrato !== comodato.folio_contrato) {
      const existeFolio = await Comodato.findOne({ where: { folio_contrato }, transaction: t });
      if (existeFolio) {
        await t.rollback();
        return res.status(400).json({ error: 'El correlativo de contrato ya se encuentra registrado.' });
      }
      comodato.folio_contrato = folio_contrato;
    }

    if (estudiante_id) comodato.estudiante_id = estudiante_id;
    if (fecha_inicio) comodato.fecha_inicio = fecha_inicio;
    if (fecha_devolucion_prevista) comodato.fecha_devolucion_prevista = fecha_devolucion_prevista;

    // Si el instrumento cambia, necesitamos actualizar las disponibilidades
    if (instrumento_id && parseInt(instrumento_id) !== comodato.instrumento_id) {
      // 1. Liberar instrumento anterior
      const oldInstrumento = await Instrumento.findByPk(comodato.instrumento_id, { transaction: t });
      if (oldInstrumento) {
        await oldInstrumento.update({ estado_disponibilidad: 'DISPONIBLE' }, { transaction: t });
      }

      // 2. Validar y ocupar nuevo instrumento
      const newInstrumento = await Instrumento.findByPk(instrumento_id, { transaction: t });
      if (!newInstrumento || newInstrumento.estado_disponibilidad !== 'DISPONIBLE') {
        await t.rollback();
        return res.status(400).json({ error: 'El nuevo instrumento seleccionado no está disponible para préstamo.' });
      }
      if (newInstrumento.estado_conservacion === 'MALO') {
        await t.rollback();
        return res.status(400).json({ error: 'El instrumento requiere reparación y no puede ser asignado.' });
      }
      await newInstrumento.update({ estado_disponibilidad: 'PRESTADO' }, { transaction: t });
      
      comodato.instrumento_id = instrumento_id;
    }

    await comodato.save({ transaction: t });
    await t.commit();

    res.json({ message: 'Comodato actualizado con éxito', comodato });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar comodato:', error);
    handleSequelizeError(error, res, 'Error interno al actualizar el comodato');
  }
};

// Eliminar un comodato
export const deleteComodato = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const comodato = await Comodato.findByPk(id, { transaction: t });
    if (!comodato) {
      await t.rollback();
      return res.status(404).json({ error: 'El comodato no existe.' });
    }

    // Si el comodato estaba activo, devolvemos el instrumento a DISPONIBLE
    if (comodato.estado === 'ACTIVO') {
      const instrumento = await Instrumento.findByPk(comodato.instrumento_id, { transaction: t });
      if (instrumento) {
        await instrumento.update({ estado_disponibilidad: 'DISPONIBLE' }, { transaction: t });
      }
    }

    await comodato.destroy({ transaction: t });
    await t.commit();
    res.json({ message: 'Comodato eliminado con éxito.' });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar comodato:', error);
    res.status(500).json({ error: 'Error interno al eliminar el comodato' });
  }
};
