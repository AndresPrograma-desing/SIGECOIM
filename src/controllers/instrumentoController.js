import { Instrumento } from '../models/index.js';

// Listar todos los instrumentos
export const getInstrumentos = async (req, res) => {
  try {
    const instrumentos = await Instrumento.findAll({
      order: [['id', 'DESC']],
    });
    res.json(instrumentos);
  } catch (error) {
    console.error('Error al obtener instrumentos:', error);
    res.status(500).json({ error: 'Error interno al obtener los instrumentos' });
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
    const { codigo_inventario, nombre, marca, modelo, numero_serie, medida, color, accesorios, estado_conservacion, estado_disponibilidad } = req.body;

    if (!codigo_inventario || !nombre) {
      return res.status(400).json({ error: 'Código de inventario y nombre son campos requeridos' });
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
      estado_conservacion: estado_conservacion || 'BUENO',
      estado_disponibilidad: estado_disponibilidad || 'DISPONIBLE',
    });

    res.status(201).json(nuevoInstrumento);
  } catch (error) {
    console.error('Error al crear instrumento:', error);
    res.status(500).json({ error: 'Error interno al crear el instrumento' });
  }
};

// Actualizar un instrumento existente
export const updateInstrumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_inventario, nombre, marca, modelo, numero_serie, medida, color, accesorios, estado_conservacion, estado_disponibilidad } = req.body;

    const instrumento = await Instrumento.findByPk(id);
    if (!instrumento) {
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }

    // Validar duplicado de código de inventario si cambia
    if (codigo_inventario && codigo_inventario !== instrumento.codigo_inventario) {
      const existeCodigo = await Instrumento.findOne({ where: { codigo_inventario } });
      if (existeCodigo) {
        return res.status(400).json({ error: 'El código de inventario ya se encuentra registrado' });
      }
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
      estado_conservacion: estado_conservacion || instrumento.estado_conservacion,
      estado_disponibilidad: estado_disponibilidad || instrumento.estado_disponibilidad,
    });

    res.json(instrumento);
  } catch (error) {
    console.error('Error al actualizar instrumento:', error);
    res.status(500).json({ error: 'Error interno al actualizar el instrumento' });
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
