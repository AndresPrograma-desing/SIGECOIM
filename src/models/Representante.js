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
    unique: 'uq_representante_cedula',
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
    unique: 'uq_representante_email',
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
