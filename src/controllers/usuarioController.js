import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';

// Obtener todos los usuarios (excluyendo la contraseña)
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']],
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener la lista de usuarios.' });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
    }

    // Verificar si el correo ya existe
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario en la BD
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'COORDINADOR',
      estado: true,
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
      },
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar el nuevo usuario.' });
  }
};

// Cambiar estado (Activar / Desactivar) usuario
export const toggleEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.estado = !usuario.estado;
    await usuario.save();

    res.json({
      message: `Usuario ${usuario.estado ? 'activado' : 'desactivado'} con éxito.`,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error);
    res.status(500).json({ error: 'Error al cambiar estado del usuario.' });
  }
};

// Actualizar un usuario existente
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Verificar si el correo ya existe en otro usuario
    if (email && email !== usuario.email) {
      const existeEmail = await Usuario.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro usuario.' });
      }
      usuario.email = email;
    }

    if (nombre) usuario.nombre = nombre;
    if (rol) usuario.rol = rol;

    // Actualizar contraseña solo si se proporciona
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    await usuario.save();

    res.json({
      message: 'Usuario actualizado con éxito.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el usuario.' });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    
    // Opcional: Impedir que se elimine el administrador principal
    if (usuario.email === 'admin@sigecoim.com') {
      return res.status(400).json({ error: 'No se puede eliminar al ana principal del sistema.' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el usuario.' });
  }
};
