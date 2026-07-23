import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Representante = sequelize.define('REPRESENTANTE', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'REPRESENTANTE',
  timestamps: false,
});

export default Representante;
