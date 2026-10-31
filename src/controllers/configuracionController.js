import { Configuracion } from '../models/index.js';

// Valores por defecto de cada clave de configuración, usados cuando la fila
// todavía no existe en base de datos (primer arranque del sistema).
const DEFAULTS = {
  dias_alerta_vencimiento: '7',
};

export const CLAVES_PERMITIDAS = Object.keys(DEFAULTS);

// Lee el valor de una clave de configuración (string). Si no existe, retorna
// el default; si tampoco hay default, retorna null.
export const getConfigValor = async (clave) => {
  const fila = await Configuracion.findByPk(clave);
  if (fila) return fila.valor;
  return DEFAULTS[clave] ?? null;
};

// Lista las configuraciones editables por el administrador, combinando lo
// guardado en base de datos con los defaults de las claves aún no definidas.
export const getConfiguracion = async (req, res) => {
  try {
    const filas = await Configuracion.findAll();
    const guardado = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));
    const resultado = Object.fromEntries(
      CLAVES_PERMITIDAS.map((clave) => [clave, guardado[clave] ?? DEFAULTS[clave]]),
    );
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener la configuración:', error);
    res.status(500).json({ error: 'Error interno al obtener la configuración' });
  }
};

// Actualiza una o más claves de configuración (upsert por clave).
export const updateConfiguracion = async (req, res) => {
  try {
    const cambios = req.body || {};
    const clavesInvalidas = Object.keys(cambios).filter((clave) => !CLAVES_PERMITIDAS.includes(clave));
    if (clavesInvalidas.length > 0) {
      return res.status(400).json({ error: `Clave(s) de configuración no reconocida(s): ${clavesInvalidas.join(', ')}` });
    }

    if (cambios.dias_alerta_vencimiento !== undefined) {
      const dias = parseInt(cambios.dias_alerta_vencimiento, 10);
      if (!Number.isInteger(dias) || dias < 1 || dias > 365) {
        return res.status(400).json({ error: 'Los días de anticipación deben ser un número entero entre 1 y 365.' });
      }
    }

    for (const [clave, valor] of Object.entries(cambios)) {
      await Configuracion.upsert({ clave, valor: String(valor) });
    }

    res.json({ message: 'Configuración actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    res.status(500).json({ error: 'Error interno al actualizar la configuración' });
  }
};
