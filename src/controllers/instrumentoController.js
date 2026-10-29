import { Op, Sequelize } from 'sequelize';
import { sequelize, Instrumento, HistorialUbicacion, Usuario } from '../models/index.js';
import { handleSequelizeError } from '../utils/sequelizeErrors.js';

// Listar todos los instrumentos (admite filtro opcional ?ubicacion=)
export const getInstrumentos = async (req, res) => {
  try {
    const { ubicacion } = req.query;
    const where = {};
    if (ubicacion) where.ubicacion = { [Op.like]: `%${ubicacion}%` };

    const instrumentos = await Instrumento.findAll({
      where,
      order: [['id', 'DESC']],
    });
    res.json(instrumentos);
  } catch (error) {
    console.error('Error al obtener instrumentos:', error);
    res.status(500).json({ error: 'Error interno al obtener los instrumentos' });
  }
};

// Resumen de stock agrupado por nombre de instrumento y disponibilidad.
export const getStockPorTipo = async (req, res) => {
  try {
    const stock = await Instrumento.findAll({
      attributes: [
        'nombre',
        'estado_disponibilidad',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
      ],
      group: ['nombre', 'estado_disponibilidad'],
      raw: true,
    });
    res.json(stock);
  } catch (error) {
    console.error('Error al obtener el stock por tipo:', error);
    res.status(500).json({ error: 'Error interno al obtener el stock por tipo' });
  }
};

// Historial de cambios de ubicación de un instrumento
export const getHistorialUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await HistorialUbicacion.findAll({
      where: { instrumento_id: id },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }],
      order: [['fecha', 'DESC'], ['id', 'DESC']],
    });
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener el historial de ubicación:', error);
    res.status(500).json({ error: 'Error interno al obtener el historial de ubicación' });
  }
};

// Obtener un instrumento por ID
export const getInstrumentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const instrumento = await Instrumento.findByPk(id);
    if (!instrumento) {
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }
    res.json(instrumento);
  } catch (error) {
    console.error('Error al obtener el instrumento:', error);
    res.status(500).json({ error: 'Error interno al obtener el instrumento' });
  }
};

// Crear un nuevo instrumento
export const createInstrumento = async (req, res) => {
  try {
    const { codigo_inventario, nombre, marca, modelo, numero_serie, medida, color, accesorios, ubicacion, estado_conservacion, estado_disponibilidad } = req.body;

    if (!codigo_inventario || !nombre || !numero_serie) {
      return res.status(400).json({ error: 'Código de inventario, nombre y número de serie son campos requeridos' });
    }

    // Validar si ya existe el código de inventario
    const existeCodigo = await Instrumento.findOne({ where: { codigo_inventario } });
    if (existeCodigo) {
      return res.status(400).json({ error: 'El código de inventario ya se encuentra registrado' });
    }

    const nuevoInstrumento = await Instrumento.create({
      codigo_inventario,
      nombre,
      marca,
      modelo,
      numero_serie,
      medida,
      color,
      accesorios,
      ubicacion: ubicacion || null,
      estado_conservacion: estado_conservacion || 'BUENO',
      estado_disponibilidad: estado_disponibilidad || 'DISPONIBLE',
    });

    res.status(201).json(nuevoInstrumento);
  } catch (error) {
    console.error('Error al crear instrumento:', error);
    handleSequelizeError(error, res, 'Error interno al crear el instrumento');
  }
};

// Actualizar un instrumento existente
export const updateInstrumento = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { codigo_inventario, nombre, marca, modelo, numero_serie, medida, color, accesorios, ubicacion, estado_conservacion, estado_disponibilidad, usuario_id } = req.body;

    const instrumento = await Instrumento.findByPk(id, { transaction: t });
    if (!instrumento) {
      await t.rollback();
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }

    // Validar duplicado de código de inventario si cambia
    if (codigo_inventario && codigo_inventario !== instrumento.codigo_inventario) {
      const existeCodigo = await Instrumento.findOne({ where: { codigo_inventario }, transaction: t });
      if (existeCodigo) {
        await t.rollback();
        return res.status(400).json({ error: 'El código de inventario ya se encuentra registrado' });
      }
    }

    // Si la ubicación cambia, dejar constancia en el historial antes de actualizar
    if (ubicacion !== undefined && ubicacion !== instrumento.ubicacion) {
      let userId = usuario_id;
      if (!userId) {
        const defaultAdmin = await Usuario.findOne({ where: { email: 'admin@sigecoim.com' }, transaction: t });
        userId = defaultAdmin ? defaultAdmin.id : 1;
      }
      await HistorialUbicacion.create({
        instrumento_id: instrumento.id,
        ubicacion_anterior: instrumento.ubicacion,
        ubicacion_nueva: ubicacion,
        usuario_id: userId,
      }, { transaction: t });
    }

    await instrumento.update({
      codigo_inventario: codigo_inventario || instrumento.codigo_inventario,
      nombre: nombre || instrumento.nombre,
      marca: marca !== undefined ? marca : instrumento.marca,
      modelo: modelo !== undefined ? modelo : instrumento.modelo,
      numero_serie: numero_serie !== undefined ? numero_serie : instrumento.numero_serie,
      medida: medida !== undefined ? medida : instrumento.medida,
      color: color !== undefined ? color : instrumento.color,
      accesorios: accesorios !== undefined ? accesorios : instrumento.accesorios,
      ubicacion: ubicacion !== undefined ? ubicacion : instrumento.ubicacion,
      estado_conservacion: estado_conservacion || instrumento.estado_conservacion,
      estado_disponibilidad: estado_disponibilidad || instrumento.estado_disponibilidad,
    }, { transaction: t });

    await t.commit();
    res.json(instrumento);
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar instrumento:', error);
    handleSequelizeError(error, res, 'Error interno al actualizar el instrumento');
  }
};

// Eliminar un instrumento
export const deleteInstrumento = async (req, res) => {
  try {
    const { id } = req.params;
    const instrumento = await Instrumento.findByPk(id);
    if (!instrumento) {
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }

    // Validar si el instrumento está prestado (no debería poder eliminarse si está en comodato activo)
    if (instrumento.estado_disponibilidad === 'PRESTADO') {
      return res.status(400).json({ error: 'No se puede eliminar un instrumento que se encuentra prestado' });
    }

    await instrumento.destroy();
    res.json({ message: 'Instrumento eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar instrumento:', error);
    res.status(500).json({ error: 'Error interno al eliminar el instrumento' });
  }
};
