import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'sigecoim_default_jwt_secret_key_2026';

// Verifica el JWT (staff o estudiante) y adjunta su payload en req.user
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Restringe la ruta según el tipo de cuenta ('STAFF' o 'ESTUDIANTE')
export const requireTipo = (...tipos) => (req, res, next) => {
  if (!req.user || !tipos.includes(req.user.tipo)) {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
  }
  next();
};

// Restringe la ruta según el rol del usuario de staff (ANALISTA_BIENES, DIRECTOR)
export const requireRol = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
  }
  next();
};
