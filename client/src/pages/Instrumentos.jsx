import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Snackbar } from '@mui/material';
import { Plus } from 'lucide-react';
import api from '../services/api';
import InstrumentoFilters from '../components/InstrumentoFilters';
import InstrumentoTable from '../components/InstrumentoTable';
import InstrumentoDialog from '../components/InstrumentoDialog';
import ConfirmDialog from '../components/ConfirmDialog';

const Instrumentos = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de Filtros
  const [search, setSearch] = useState('');
  const [filterDisponibilidad, setFilterDisponibilidad] = useState('');

  // Estados de Modal (Crear/Editar)
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInstrumento, setEditingInstrumento] = useState(null);
  const [formData, setFormData] = useState({
    codigo_inventario: '',
    nombre: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    medida: '',
    color: '',
    accesorios: '',
    estado_conservacion: 'BUENO',
    estado_disponibilidad: 'DISPONIBLE',
  });
  const [formError, setFormError] = useState('');

  // Notificaciones
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchInstrumentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/instrumentos');
      setInstrumentos(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de instrumentos. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  const handleOpenCreate = () => {
    setEditingInstrumento(null);
    setFormData({
      codigo_inventario: '',
      nombre: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      medida: '',
      color: '',
      accesorios: '',
      estado_conservacion: 'BUENO',
      estado_disponibilidad: 'DISPONIBLE',
    });
    setFormError('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (inst) => {
    setEditingInstrumento(inst);
    setFormData({
      codigo_inventario: inst.codigo_inventario,
      nombre: inst.nombre,
      marca: inst.marca || '',
      modelo: inst.modelo || '',
      numero_serie: inst.numero_serie || '',
      medida: inst.medida || '',
      color: inst.color || '',
      accesorios: inst.accesorios || '',
      estado_conservacion: inst.estado_conservacion,
      estado_disponibilidad: inst.estado_disponibilidad,
    });
    setFormError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.codigo_inventario.trim() || !formData.nombre.trim()) {
      setFormError('Código de Inventario y Nombre son requeridos.');
      return;
    }

    try {
      if (editingInstrumento) {
        await api.put(`/instrumentos/${editingInstrumento.id}`, formData);
        showNotification('Instrumento actualizado con éxito.', 'success');
      } else {
        await api.post('/instrumentos', formData);
        showNotification('Instrumento creado con éxito.', 'success');
      }
      setOpenDialog(false);
      fetchInstrumentos();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Ocurrió un error al guardar el instrumento.');
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return;
    try {
      const res = await api.delete(`/instrumentos/${confirmDialog.id}`);
      showNotification(res.data.message, 'success');
      fetchInstrumentos();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'No se pudo eliminar el instrumento.', 'error');
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

  const filteredInstrumentos = instrumentos.filter((inst) => {
    const matchText =
      inst.nombre.toLowerCase().includes(search.toLowerCase()) ||
      inst.codigo_inventario.toLowerCase().includes(search.toLowerCase()) ||
      (inst.marca && inst.marca.toLowerCase().includes(search.toLowerCase())) ||
      (inst.modelo && inst.modelo.toLowerCase().includes(search.toLowerCase()));

    const matchDisponibilidad = filterDisponibilidad ? inst.estado_disponibilidad === filterDisponibilidad : true;

    return matchText && matchDisponibilidad;
  });

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* Cabecera Mejorada */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2, 
          mb: 4 
        }}
      >
        <Typography variant="h4">Inventario de Instrumentos</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleOpenCreate}
          sx={{
            px: 3,
            py: 1,
            whiteSpace: 'nowrap' // Evita que el texto del botón se rompa en dos líneas
          }}
        >
          Nuevo Instrumento
        </Button>
      </Box>

      {/* Filtros */}
      <InstrumentoFilters
        search={search}
        setSearch={setSearch}
        filterDisponibilidad={filterDisponibilidad}
        setFilterDisponibilidad={setFilterDisponibilidad}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de Resultados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <InstrumentoTable
            instrumentos={filteredInstrumentos}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
          />
        </Box>
      )}

      {/* Dialog Formularios */}
      <InstrumentoDialog
        open={openDialog}
        onClose={handleCloseDialog}
        editingInstrumento={editingInstrumento}
        formData={formData}
        onChangeForm={handleChangeForm}
        onSubmit={handleSubmit}
        formError={formError}
      />

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Instrumento"
        message="¿Estás seguro de que deseas eliminar este instrumento del inventario? Esta acción es irreversible."
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

export default Instrumentos;