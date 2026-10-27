// Nombres legibles en español para los campos que suelen aparecer en errores
// de restricción única / foránea de Sequelize, para no mostrarle al usuario
// el nombre de columna crudo (ej. "numero_serie" -> "Número de serie").
const FIELD_LABELS = {
  codigo_inventario: 'El código de inventario',
  numero_serie: 'El número de serie',
  cedula: 'La cédula',
  email: 'El correo electrónico',
  folio_contrato: 'El correlativo de contrato',
  comodato_id: 'El comodato',
};

const labelFor = (field) => FIELD_LABELS[field] || `El campo "${field}"`;

/**
 * Traduce errores conocidos de Sequelize (restricción única, validación,
 * clave foránea) a una respuesta 400 con mensaje claro. Si el error no es
 * uno de esos tipos, responde 500 con `fallbackMessage` (mismo comportamiento
 * que había antes en cada controlador) y lo deja loguear a quien llama.
 */
export const handleSequelizeError = (error, res, fallbackMessage) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors?.[0]?.path;
    const message = field
      ? `${labelFor(field)} ya se encuentra registrado.`
      : 'Ya existe un registro con esos datos.';
    return res.status(400).json({ error: message });
  }

  if (error.name === 'SequelizeValidationError') {
    const message = error.errors?.[0]?.message || 'Los datos enviados no son válidos.';
    return res.status(400).json({ error: message });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'La referencia indicada no existe o no se puede usar.' });
  }

  return res.status(500).json({ error: fallbackMessage });
};
