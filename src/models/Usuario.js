import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Usuario = sequelize.define('USUARIO', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: 'uq_usuario_email',
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // STRING en vez de ENUM a propósito: con sync({ alter: true }) (ver db.js),
  // Sequelize re-ejecuta "ALTER COLUMN ... SET DEFAULT" seguido de
  // "ALTER COLUMN ... TYPE enum... USING (...)" en CADA arranque para
  // cualquier columna ENUM, y Postgres no puede re-castear ese default recién
  // puesto durante el cambio de tipo ("default for column rol cannot be cast
  // automatically to type enum_USUARIO_rol") — rompe el boot apenas el ENUM
  // cambia de valores. Los valores permitidos (ROLES_PERMITIDOS) se validan
  // en usuarioController.js en su lugar.
  rol: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'DIRECTOR',
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'USUARIO',
  timestamps: false,
});

export default Usuario;
