import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: process.env.DB_SSL === 'false' ? {} : {
      ssl: { require: true, rejectUnauthorized: false }, // Supabase exige SSL
    },
    logging: false, // Cambia a console.log si quieres ver los SQL generados en consola
    define: {
      timestamps: false, // Para que no agregue automáticamente createdAt/updatedAt si no los usas
      freezeTableName: true // Mantiene el nombre exacto de la tabla (ej. INSTRUMENTO)
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión exitosa a PostgreSQL (Supabase)');

    // Sincronizar automáticamente el esquema de DB (agregar columnas faltantes)
    await sequelize.sync({ alter: true });
    console.log(' Esquema de base de datos verificado y actualizado.');

    // Migraciones automáticas de datos de roles. USUARIO.rol es STRING (no
    // ENUM) a propósito — ver el comentario en models/Usuario.js — así que
    // estos UPDATE son simples y no interactúan con sync({ alter: true }).
    try {
      await sequelize.query('UPDATE "USUARIO" SET rol = \'ANALISTA_BIENES\' WHERE rol = \'ADMINISTRADOR\'');
      await sequelize.query('UPDATE "USUARIO" SET rol = \'DIRECTOR\' WHERE rol = \'COORDINADOR\'');
      console.log(' Migración de roles completada con éxito.');
    } catch (migError) {
      console.log(' Omitiendo actualización de roles (la tabla o campo ya se encuentra actualizado).');
    }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1);
  }
};

export default sequelize;