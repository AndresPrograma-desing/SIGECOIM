import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Tabla clave/valor para ajustes del sistema editables por el administrador
// (ej. ventana de días para las alertas de vencimiento), sin necesidad de
// agregar una columna nueva por cada parámetro futuro.
const Configuracion = sequelize.define('CONFIGURACION', {
  clave: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  valor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'CONFIGURACION',
  timestamps: false,
});

export default Configuracion;
