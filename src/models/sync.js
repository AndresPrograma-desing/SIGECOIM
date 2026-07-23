import bcrypt from 'bcryptjs';
import { sequelize, Usuario, Representante, Estudiante } from './index.js';

const syncDatabase = async () => {
  try {
    console.log('Iniciando la sincronización de la base de datos...');
    
    // Sincronizar todos los modelos
    await sequelize.sync({ force: true });
    console.log(' Base de datos y tablas sincronizadas correctamente.');

    // Crear un usuario administrador inicial
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await Usuario.create({
      nombre: 'Administrador General',
      email: 'admin@sigecoim.com',
      password: hashedPassword,
      rol: 'ADMINISTRADOR',
      estado: true,
    });

    console.log(' Usuario administrador por defecto creado exitosamente: admin@sigecoim.com / admin123');

    // Crear representantes
    const rep1 = await Representante.create({
      cedula: 'V-12345678',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '0412-1112233',
      email: 'juan.perez@email.com',
      direccion: 'Av. Libertador, Edif. A, Apto 2',
    });

    const rep2 = await Representante.create({
      cedula: 'V-87654321',
      nombre: 'María',
      apellido: 'Rodríguez',
      telefono: '0414-9998877',
      email: 'maria.rod@email.com',
      direccion: 'Calle Bolívar, Casa Nro 45',
    });

    console.log(' Representantes de prueba sembrados.');

    // Crear estudiantes
    await Estudiante.create({
      cedula: 'V-28111222',
      nombre: 'Carlos',
      apellido: 'Pérez',
      fecha_nacimiento: '2010-05-15',
      telefono: '0412-2223344',
      direccion: 'Av. Libertador, Edif. A, Apto 2',
      representante_id: rep1.id,
    });

    await Estudiante.create({
      cedula: null,
      nombre: 'Ana',
      apellido: 'Pérez',
      fecha_nacimiento: '2014-08-20',
      representante_id: rep1.id,
    });

    await Estudiante.create({
      cedula: 'V-29444555',
      nombre: 'Luis',
      apellido: 'Rodríguez',
      fecha_nacimiento: '2011-03-10',
      representante_id: rep2.id,
    });

    console.log(' Estudiantes de prueba sembrados.');
    console.log(' Sincronización y siembra completadas con éxito.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error sincronizando la base de datos:', error);
    process.exit(1);
  }
};

syncDatabase();
