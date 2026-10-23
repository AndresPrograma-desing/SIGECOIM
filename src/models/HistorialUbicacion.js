import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const HistorialUbicacion = sequelize.define('HISTORIAL_UBICACION', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instrumento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'INSTRUMENTO',
      key: 'id',
    },
  },
  ubicacion_anterior: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ubicacion_nueva: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
  tableName: 'HISTORIAL_UBICACION',
  timestamps: false,
});

export default HistorialUbicacion;
