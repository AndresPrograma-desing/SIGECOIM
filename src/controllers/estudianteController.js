import { Estudiante, Representante, Comodato } from '../models/index.js';

// Obtener todos los estudiantes con sus representantes
export const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({
      include: [
        {
          model: Representante,
          as: 'representante',
        },
      ],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']],
    });
    res.json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener estudiantes' });
  }
};

// Crear un estudiante
export const createEstudiante = async (req, res) => {
  try {
    const {
      cedula,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      direccion,
      rep_cedula,
      rep_nombre,
      rep_apellido,
      rep_telefono,
      rep_email,
      rep_direccion
    } = req.body;

    if (!nombre || !apellido || !fecha_nacimiento) {
      return res.status(400).json({ error: 'Nombre, apellido y fecha de nacimiento son requeridos.' });
    }

    // Validar cédula única del estudiante (si se provee)
    if (cedula) {
      const existeCedula = await Estudiante.findOne({ where: { cedula } });
      if (existeCedula) {
        return res.status(400).json({ error: 'La cédula del estudiante ya se encuentra registrada.' });
      }
    }

    // Calcular edad
    const birthDate = new Date(fecha_nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const esMenor = age < 18;

    let representante_id = null;

    if (esMenor) {
      if (!rep_cedula || !rep_nombre || !rep_apellido || !rep_telefono || !rep_direccion) {
        return res.status(400).json({ error: 'Para estudiantes menores de edad, todos los datos del representante legal son obligatorios.' });
      }

      // Buscar si el representante ya existe
      let representante = await Representante.findOne({ where: { cedula: rep_cedula } });
      if (!representante) {
        representante = await Representante.create({
          cedula: rep_cedula,
          nombre: rep_nombre,
          apellido: rep_apellido,
          telefono: rep_telefono,
          email: rep_email || null,
          direccion: rep_direccion
        });
      } else {
        // Actualizar datos del representante
        await representante.update({
          nombre: rep_nombre,
          apellido: rep_apellido,
          telefono: rep_telefono,
          email: rep_email || null,
          direccion: rep_direccion
        });
      }
      representante_id = representante.id;
    }

    const nuevoEstudiante = await Estudiante.create({
      cedula: cedula || null,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono: telefono || null,
      direccion: direccion || null,
      representante_id
    });

    const estudianteCompleto = await Estudiante.findByPk(nuevoEstudiante.id, {
      include: [{ model: Representante, as: 'representante' }]
    });

    res.status(201).json(estudianteCompleto);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear estudiante.' });
  }
};

// Actualizar un estudiante
export const updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      direccion,
      rep_cedula,
      rep_nombre,
      rep_apellido,
      rep_telefono,
      rep_email,
      rep_direccion
    } = req.body;

    const estudiante = await Estudiante.findByPk(id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Validar cédula única si se cambia
    if (cedula && cedula !== estudiante.cedula) {
      const existeCedula = await Estudiante.findOne({ where: { cedula } });
      if (existeCedula) {
        return res.status(400).json({ error: 'La cédula del estudiante ya se encuentra registrada.' });
      }
    }

    // Calcular edad
    const birthDate = new Date(fecha_nacimiento || estudiante.fecha_nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const esMenor = age < 18;

    let representante_id = estudiante.representante_id;

    if (esMenor) {
      if (!rep_cedula || !rep_nombre || !rep_apellido || !rep_telefono || !rep_direccion) {
        return res.status(400).json({ error: 'Para estudiantes menores de edad, todos los datos del representante legal son obligatorios.' });
      }

      let representante = await Representante.findOne({ where: { cedula: rep_cedula } });
      if (!representante) {
        representante = await Representante.create({
          cedula: rep_cedula,
          nombre: rep_nombre,
          apellido: rep_apellido,
          telefono: rep_telefono,
          email: rep_email || null,
          direccion: rep_direccion
        });
      } else {
        await representante.update({
          nombre: rep_nombre,
          apellido: rep_apellido,
          telefono: rep_telefono,
          email: rep_email || null,
          direccion: rep_direccion
        });
      }
      representante_id = representante.id;
    } else {
      // Si pasa a ser mayor de edad, removemos el representante
      representante_id = null;
    }

    await estudiante.update({
      cedula: cedula !== undefined ? (cedula || null) : estudiante.cedula,
      nombre: nombre || estudiante.nombre,
      apellido: apellido || estudiante.apellido,
      fecha_nacimiento: fecha_nacimiento || estudiante.fecha_nacimiento,
      telefono: telefono !== undefined ? (telefono || null) : estudiante.telefono,
      direccion: direccion !== undefined ? (direccion || null) : estudiante.direccion,
      representante_id
    });

    const estudianteActualizado = await Estudiante.findByPk(id, {
      include: [{ model: Representante, as: 'representante' }]
    });

    res.json(estudianteActualizado);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar estudiante.' });
  }
};

// Eliminar un estudiante
export const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Validar si tiene comodatos vinculados
    const tieneComodatos = await Comodato.findOne({ where: { estudiante_id: id } });
    if (tieneComodatos) {
      return res.status(400).json({ error: 'No se puede eliminar al estudiante porque posee contratos de comodato registrados.' });
    }

    await estudiante.destroy();
    res.json({ message: 'Estudiante eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar estudiante.' });
  }
};
