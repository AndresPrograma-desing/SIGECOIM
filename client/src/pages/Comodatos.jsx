import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Snackbar, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import api from '../services/api';
import ComodatoForm from '../components/ComodatoForm';
import ComodatoTable from '../components/ComodatoTable';
import DevolucionForm from '../components/DevolucionForm'; // <-- Renombramos el componente
import DrawPanel from '../components/DrawPanel';
import ConfirmDialog from '../components/ConfirmDialog';

const Comodatos = () => {
  const [comodatos, setComodatos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para el panel lateral de registro
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  // Formulario Comodato
  const [newComodato, setNewComodato] = useState({
    folio_contrato: '',
    fecha_devolucion_prevista: '',
    estudiante_id: '',
    instrumento_id: '',
  });
  const [formError, setFormError] = useState('');

  // Estado para el panel lateral de DEVOLUCIÓN
  const [isDevolucionDrawOpen, setIsDevolucionDrawOpen] = useState(false);
  const [selectedComodato, setSelectedComodato] = useState(null);
  const [devolucionData, setDevolucionData] = useState({
    estado_instrumento_recibido: 'BUENO',
    observaciones: '',
  });
  const [devFormError, setDevFormError] = useState('');

  // Notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [comRes, estRes, instRes] = await Promise.all([
        api.get('/comodatos'),
        api.get('/estudiantes'),
        api.get('/instrumentos'),
      ]);
      setComodatos(comRes.data);
      setEstudiantes(estRes.data);
      setInstrumentos(instRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la información de préstamos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [editingComodato, setEditingComodato] = useState(null);

  const handleOpenEdit = (com) => {
    setEditingComodato(com);
    setNewComodato({
      folio_contrato: com.folio_contrato,
      fecha_devolucion_prevista: com.fecha_devolucion_prevista,
      estudiante_id: com.estudiante_id,
      instrumento_id: com.instrumento_id,
    });
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingComodato(null);
    setNewComodato({
      folio_contrato: '',
      fecha_devolucion_prevista: '',
      estudiante_id: '',
      instrumento_id: '',
    });
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { folio_contrato, fecha_devolucion_prevista, estudiante_id, instrumento_id } = newComodato;

    if (!folio_contrato || !fecha_devolucion_prevista || !estudiante_id || !instrumento_id) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editingComodato) {
        await api.put(`/comodatos/${editingComodato.id}`, {
          folio_contrato,
          fecha_devolucion_prevista,
          estudiante_id,
          instrumento_id,
        });
        showNotification('Comodato actualizado con éxito.', 'success');
      } else {
        await api.post('/comodatos', {
          folio_contrato,
          fecha_devolucion_prevista,
          estudiante_id,
          instrumento_id,
        });
        showNotification('Comodato registrado con éxito.', 'success');
      }
      setIsDrawOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Ocurrió un error al guardar el préstamo.');
    }
  };

  const handleOpenDevolucion = (comodato) => {
    setSelectedComodato(comodato);
    setDevolucionData({
      estado_instrumento_recibido: comodato.instrumento?.estado_conservacion || 'BUENO',
      observaciones: '',
    });
    setDevFormError('');
    setIsDevolucionDrawOpen(true); // Abre el Drawer de devolución
  };

  const handleCloseDevolucion = () => {
    setIsDevolucionDrawOpen(false);
    setSelectedComodato(null);
  };

  const handleChangeDevData = (field, value) => {
    setDevolucionData({ ...devolucionData, [field]: value });
  };

  const handleSubmitDevolucion = async (e) => {
    e.preventDefault();
    if (!selectedComodato) return;

    try {
      await api.post(`/comodatos/${selectedComodato.id}/devolucion`, {
        estado_instrumento_recibido: devolucionData.estado_instrumento_recibido,
        observaciones: devolucionData.observaciones,
      });

      showNotification('Devolución procesada con éxito. Instrumento disponible.', 'success');
      setIsDevolucionDrawOpen(false); // Cierra el Drawer
      fetchData();
    } catch (err) {
      console.error(err);
      setDevFormError(err.response?.data?.error || 'Error al procesar la devolución.');
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return;
    try {
      const res = await api.delete(`/comodatos/${confirmDialog.id}`);
      showNotification(res.data.message, 'success');
      fetchData();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'No se pudo eliminar el préstamo.', 'error');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const availableInstruments = instrumentos.filter(
    (inst) =>
      inst.estado_disponibilidad === 'DISPONIBLE' ||
      (editingComodato && inst.id === editingComodato.instrumento_id)
  );

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="600" color="primary.main">
          Gestión de Comodatos (Préstamos)
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          startIcon={<Plus size={18} />}
        >
          Registrar Préstamo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <ComodatoTable
            comodatos={comodatos}
            onDevolucion={handleOpenDevolucion}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
          />
        </Box>
      )}

      {/* 1. Panel de Registrar/Editar Préstamo */}
      <DrawPanel
        width={500}
        open={isDrawOpen}
        onClose={() => setIsDrawOpen(false)}
        title={editingComodato ? "Editar Préstamo" : "Registrar Préstamo"}
        onSubmit={handleSubmit}
      >
        <ComodatoForm
          newComodato={newComodato}
          setNewComodato={setNewComodato}
          estudiantes={estudiantes}
          availableInstruments={availableInstruments}
          formError={formError}
        />
      </DrawPanel>

      {/* 2. Panel de Procesar Devolución */}
      <DrawPanel
        width={500}
        open={isDevolucionDrawOpen}
        onClose={handleCloseDevolucion}
        title="Procesar Devolución"
        onSubmit={handleSubmitDevolucion}
      >
        <DevolucionForm
          selectedComodato={selectedComodato}
          devolucionData={devolucionData}
          onChangeDevData={handleChangeDevData}
          formError={devFormError}
        />
      </DrawPanel>

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Préstamo"
        message="¿Estás seguro de que deseas eliminar este préstamo? Si el préstamo estaba en estado ACTIVO, el instrumento volverá automáticamente a estar DISPONIBLE."
      />

      {/* Alertas */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Comodatos;