import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Instrumento = sequelize.define('INSTRUMENTO', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo_inventario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  medida: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  accesorios: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado_conservacion: {
    type: DataTypes.ENUM('NUEVO', 'BUENO', 'REGULAR', 'MALO'),
    allowNull: false,
    defaultValue: 'BUENO',
  },
  estado_disponibilidad: {
    type: DataTypes.ENUM('DISPONIBLE', 'PRESTADO', 'MANTENIMIENTO'),
    allowNull: false,
    defaultValue: 'DISPONIBLE',
  },
}, {
  tableName: 'INSTRUMENTO',
  timestamps: false,
});

export default Instrumento;
