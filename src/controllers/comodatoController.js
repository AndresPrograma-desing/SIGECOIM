import { sequelize, Comodato, Instrumento, Estudiante, Representante, Usuario, Devolucion } from '../models/index.js';

// Listar todos los comodatos
export const getComodatos = async (req, res) => {
  try {
    const comodatos = await Comodato.findAll({
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
    res.json(comodatos);
  } catch (error) {
    console.error('Error al obtener comodatos:', error);
    res.status(500).json({ error: 'Error interno al obtener los comodatos' });
  }
};

// Registrar un comodato (préstamo)
export const createComodato = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { folio_contrato, fecha_inicio, fecha_devolucion_prevista, estudiante_id, instrumento_id, usuario_id } = req.body;

    if (!folio_contrato || !fecha_devolucion_prevista || !estudiante_id || !instrumento_id) {
      await t.rollback();
      return res.status(400).json({ error: 'Folio, fecha prevista de devolución, estudiante e instrumento son requeridos.' });
    }

    // Validar duplicado de folio
    const existeFolio = await Comodato.findOne({ where: { folio_contrato } });
    if (existeFolio) {
      await t.rollback();
      return res.status(400).json({ error: 'El folio de contrato ya se encuentra registrado.' });
    }

    // Validar que el estudiante exista
    const estudiante = await Estudiante.findByPk(estudiante_id);
    if (!estudiante) {
      await t.rollback();
      return res.status(404).json({ error: 'El estudiante seleccionado no existe.' });
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
    res.status(500).json({ error: 'Error interno al registrar el comodato' });
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
    res.status(500).json({ error: 'Error interno al registrar la devolución' });
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

    // Validar duplicado de folio si se está cambiando
    if (folio_contrato && folio_contrato !== comodato.folio_contrato) {
      const existeFolio = await Comodato.findOne({ where: { folio_contrato }, transaction: t });
      if (existeFolio) {
        await t.rollback();
        return res.status(400).json({ error: 'El folio de contrato ya se encuentra registrado.' });
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
      await newInstrumento.update({ estado_disponibilidad: 'PRESTADO' }, { transaction: t });
      
      comodato.instrumento_id = instrumento_id;
    }

    await comodato.save({ transaction: t });
    await t.commit();

    res.json({ message: 'Comodato actualizado con éxito', comodato });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar comodato:', error);
    res.status(500).json({ error: 'Error interno al actualizar el comodato' });
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
