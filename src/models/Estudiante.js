import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Estudiante = sequelize.define('ESTUDIANTE', {
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
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  representante_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'REPRESENTANTE',
      key: 'id',
    },
  },
}, {
  tableName: 'ESTUDIANTE',
  timestamps: false,
});

export default Estudiante;
