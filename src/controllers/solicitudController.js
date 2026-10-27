import { sequelize, Solicitud, Estudiante, Representante, Instrumento, Comodato } from '../models/index.js';
import { generarFolioContrato } from './comodatoController.js';
import { handleSequelizeError } from '../utils/sequelizeErrors.js';

const includeCompleto = [
  {
    model: Estudiante,
    as: 'estudiante',
    attributes: { exclude: ['password'] },
    include: [{ model: Representante, as: 'representante' }],
  },
  { model: Instrumento, as: 'instrumento' },
];

// El estudiante autenticado solicita el préstamo de un instrumento (queda PENDIENTE)
export const crearSolicitud = async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const { instrumento_id, fecha_devolucion_deseada, motivo } = req.body;

    if (!instrumento_id || !fecha_devolucion_deseada) {
      return res.status(400).json({ error: 'El instrumento y la fecha de devolución deseada son requeridos.' });
    }

    const instrumento = await Instrumento.findByPk(instrumento_id);
    if (!instrumento) {
      return res.status(404).json({ error: 'El instrumento seleccionado no existe.' });
    }

    if (instrumento.estado_disponibilidad !== 'DISPONIBLE') {
      return res.status(400).json({ error: 'El instrumento no está disponible en este momento.' });
    }

    const nuevaSolicitud = await Solicitud.create({
      estudiante_id,
      instrumento_id,
      fecha_devolucion_deseada,
      motivo: motivo || null,
      estado: 'PENDIENTE',
    });

    const solicitudCompleta = await Solicitud.findByPk(nuevaSolicitud.id, { include: includeCompleto });
    res.status(201).json(solicitudCompleta);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    handleSequelizeError(error, res, 'Error interno al registrar la solicitud.');
  }
};

// Solicitudes del estudiante autenticado
export const getMisSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      where: { estudiante_id: req.user.id },
      include: [{ model: Instrumento, as: 'instrumento' }],
      order: [['id', 'DESC']],
    });
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener mis solicitudes:', error);
    res.status(500).json({ error: 'Error interno al obtener las solicitudes.' });
  }
};

// Listado completo para el staff (opcionalmente filtrado por ?estado=)
export const getSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = estado ? { estado } : {};
    const solicitudes = await Solicitud.findAll({
      where,
      include: includeCompleto,
      order: [['id', 'DESC']],
    });
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno al obtener las solicitudes.' });
  }
};

// El staff aprueba la solicitud: crea el Comodato real y ocupa el instrumento
export const aprobarSolicitud = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id, { transaction: t });
    if (!solicitud) {
      await t.rollback();
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    if (solicitud.estado !== 'PENDIENTE') {
      await t.rollback();
      return res.status(400).json({ error: 'Esta solicitud ya fue revisada.' });
    }

    const instrumento = await Instrumento.findByPk(solicitud.instrumento_id, { transaction: t });
    if (!instrumento || instrumento.estado_disponibilidad !== 'DISPONIBLE') {
      await t.rollback();
      return res.status(400).json({ error: 'El instrumento ya no está disponible para préstamo.' });
    }

    const folio_contrato = await generarFolioContrato(t);

    const nuevoComodato = await Comodato.create({
      folio_contrato,
      fecha_inicio: new Date(),
      fecha_devolucion_prevista: solicitud.fecha_devolucion_deseada,
      estudiante_id: solicitud.estudiante_id,
      instrumento_id: solicitud.instrumento_id,
      usuario_id: req.user.id,
      estado: 'ACTIVO',
    }, { transaction: t });

    await instrumento.update({ estado_disponibilidad: 'PRESTADO' }, { transaction: t });

    await solicitud.update({
      estado: 'APROBADA',
      usuario_id: req.user.id,
      comodato_id: nuevoComodato.id,
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Solicitud aprobada. Préstamo registrado con éxito.', comodato: nuevoComodato });
  } catch (error) {
    await t.rollback();
    console.error('Error al aprobar solicitud:', error);
    handleSequelizeError(error, res, 'Error interno al aprobar la solicitud.');
  }
};

// El staff rechaza la solicitud
export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo } = req.body;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'La solicitud no existe.' });
    }

    if (solicitud.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Esta solicitud ya fue revisada.' });
    }

    await solicitud.update({
      estado: 'RECHAZADA',
      usuario_id: req.user.id,
      motivo_rechazo: motivo_rechazo || null,
    });

    res.json({ message: 'Solicitud rechazada.' });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ error: 'Error interno al rechazar la solicitud.' });
  }
};
