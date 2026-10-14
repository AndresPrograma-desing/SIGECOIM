import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Solicitud de préstamo hecha por un estudiante desde el portal público.
// Queda PENDIENTE hasta que un miembro del staff la aprueba (creando el
// Comodato real) o la rechaza.
const Solicitud = sequelize.define('SOLICITUD', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  fecha_solicitud: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_devolucion_deseada: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA'),
    allowNull: false,
    defaultValue: 'PENDIENTE',
  },
  motivo_rechazo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'USUARIO',
      key: 'id',
    },
  },
  comodato_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'COMODATO',
      key: 'id',
    },
  },
}, {
  tableName: 'SOLICITUD',
  timestamps: false,
});

export default Solicitud;
