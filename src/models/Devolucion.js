import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Devolucion = sequelize.define('DEVOLUCION', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comodato_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'COMODATO',
      key: 'id',
    },
  },
  fecha_devolucion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado_instrumento_recibido: {
    type: DataTypes.ENUM('NUEVO', 'BUENO', 'REGULAR', 'MALO'),
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'USUARIO',
      key: 'id',
    },
  },
}, {
  tableName: 'DEVOLUCION',
  timestamps: false,
});

export default Devolucion;
