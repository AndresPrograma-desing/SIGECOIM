import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Comodato = sequelize.define('COMODATO', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  folio_contrato: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_devolucion_prevista: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ESTUDIANTE',
      key: 'id',
    },
  },
  instrumento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'INSTRUMENTO',
      key: 'id',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'USUARIO',
      key: 'id',
    },
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'FINALIZADO', 'VENCIDO'),
    allowNull: false,
    defaultValue: 'ACTIVO',
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'COMODATO',
  timestamps: false,
});

export default Comodato;
