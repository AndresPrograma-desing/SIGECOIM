import sequelize from '../config/db.js';
import Usuario from './Usuario.js';
import Representante from './Representante.js';
import Estudiante from './Estudiante.js';
import Instrumento from './Instrumento.js';
import Comodato from './Comodato.js';
import Devolucion from './Devolucion.js';

// --- Relaciones ---

// Representante & Estudiante (1:N)
Representante.hasMany(Estudiante, { foreignKey: 'representante_id', as: 'estudiantes' });
Estudiante.belongsTo(Representante, { foreignKey: 'representante_id', as: 'representante' });

// Estudiante & Comodato (1:N)
Estudiante.hasMany(Comodato, { foreignKey: 'estudiante_id', as: 'comodatos' });
Comodato.belongsTo(Estudiante, { foreignKey: 'estudiante_id', as: 'estudiante' });

// Instrumento & Comodato (1:N)
Instrumento.hasMany(Comodato, { foreignKey: 'instrumento_id', as: 'comodatos' });
Comodato.belongsTo(Instrumento, { foreignKey: 'instrumento_id', as: 'instrumento' });

// Usuario & Comodato (1:N) - Usuario que registra el comodato
Usuario.hasMany(Comodato, { foreignKey: 'usuario_id', as: 'comodatos' });
Comodato.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Comodato & Devolución (1:1)
Comodato.hasOne(Devolucion, { foreignKey: 'comodato_id', as: 'devolucion' });
Devolucion.belongsTo(Comodato, { foreignKey: 'comodato_id', as: 'comodato' });

// Usuario & Devolución (1:N) - Usuario que registra la devolución
Usuario.hasMany(Devolucion, { foreignKey: 'usuario_id', as: 'devoluciones' });
Devolucion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

export {
  sequelize,
  Usuario,
  Representante,
  Estudiante,
  Instrumento,
  Comodato,
  Devolucion
};
