import { Estudiante, Representante } from '../models/index.js';

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
