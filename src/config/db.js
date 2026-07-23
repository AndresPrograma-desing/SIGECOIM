import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
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
    console.log(' Conexión exitosa a MySQL (XAMPP)');
    // Sincronizar automáticamente el esquema de DB (agregar columnas faltantes)
    await sequelize.sync({ alter: true });
    console.log(' Esquema de base de datos verificado y actualizado.');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1);
  }
};

export default sequelize;