import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Snackbar, Button, TextField, InputAdornment } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import EstudianteForm from '../components/EstudianteForm';
import EstudianteTable from '../components/EstudianteTable';
import DrawPanel from '../components/DrawPanel';
import ConfirmDialog from '../components/ConfirmDialog';

const initialFormData = {
  cedula: '',
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  telefono: '',
  direccion: '',
  rep_cedula: '',
  rep_nombre: '',
  rep_apellido: '',
  rep_telefono: '',
  rep_email: '',
  rep_direccion: '',
};

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Panel lateral registro/edición
  const [isDrawOpen, setIsDrawOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState('');

  // Confirmación eliminación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingEstudiante, setDeletingEstudiante] = useState(null);

  // Notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/estudiantes');
      setEstudiantes(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la información de los estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const handleOpenCreate = () => {
    setEditingEstudiante(null);
    setFormData(initialFormData);
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleOpenEdit = (est) => {
    setEditingEstudiante(est);
    setFormData({
      cedula: est.cedula || '',
      nombre: est.nombre || '',
      apellido: est.apellido || '',
      fecha_nacimiento: est.fecha_nacimiento || '',
      telefono: est.telefono || '',
      direccion: est.direccion || '',
      rep_cedula: est.representante?.cedula || '',
      rep_nombre: est.representante?.nombre || '',
      rep_apellido: est.representante?.apellido || '',
      rep_telefono: est.representante?.telefono || '',
      rep_email: est.representante?.email || '',
      rep_direccion: est.representante?.direccion || '',
    });
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleDeleteClick = (est) => {
    setDeletingEstudiante(est);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/estudiantes/${deletingEstudiante.id}`);
      setNotification({
        open: true,
        message: 'Estudiante eliminado con éxito.',
        severity: 'success',
      });
      fetchEstudiantes();
    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: err.response?.data?.error || 'No se pudo eliminar al estudiante.',
        severity: 'error',
      });
    } finally {
      setIsConfirmOpen(false);
      setDeletingEstudiante(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, fecha_nacimiento } = formData;

    if (!nombre.trim() || !apellido.trim() || !fecha_nacimiento) {
      setFormError('Nombre, Apellido y Fecha de Nacimiento son requeridos.');
      return;
    }

    // Validar representante si es menor de edad
    const birthDate = new Date(fecha_nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      const { rep_cedula, rep_nombre, rep_apellido, rep_telefono, rep_direccion } = formData;
      if (!rep_cedula.trim() || !rep_nombre.trim() || !rep_apellido.trim() || !rep_telefono.trim() || !rep_direccion.trim()) {
        setFormError('Todos los datos del Representante Legal son obligatorios para estudiantes menores de edad.');
        return;
      }
    }

    try {
      if (editingEstudiante) {
        await api.put(`/estudiantes/${editingEstudiante.id}`, formData);
        setNotification({
          open: true,
          message: 'Estudiante actualizado con éxito.',
          severity: 'success',
        });
      } else {
        await api.post('/estudiantes', formData);
        setNotification({
          open: true,
          message: 'Estudiante registrado con éxito.',
          severity: 'success',
        });
      }
      setIsDrawOpen(false);
      fetchEstudiantes();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Ocurrió un error al guardar el estudiante.');
    }
  };

  // Filtrado de estudiantes en la barra de búsqueda
  const filteredEstudiantes = estudiantes.filter((est) => {
    const fullName = `${est.nombre} ${est.apellido}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (est.cedula && est.cedula.toLowerCase().includes(searchLower)) ||
      (est.representante && `${est.representante.nombre} ${est.representante.apellido}`.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Cabecera y acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Estudiantes Registrados
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={handleOpenCreate}
          sx={{ py: 1.2, px: 3, fontWeight: 'bold' }}
        >
          Nuevo Estudiante
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Barra de Búsqueda */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <TextField
          placeholder="Buscar estudiante por nombre, cédula o representante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="rgba(0,0,0,0.4)" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabla de Resultados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <EstudianteTable
            estudiantes={filteredEstudiantes}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
          />
        </Box>
      )}

      {/* Drawer flotante para Registrar/Editar Estudiante */}
      <DrawPanel
        width={550}
        open={isDrawOpen}
        onClose={() => setIsDrawOpen(false)}
        title={editingEstudiante ? 'Editar Estudiante' : 'Registrar Estudiante'}
        onSubmit={handleSubmit}
      >
        <EstudianteForm
          formData={formData}
          setFormData={setFormData}
          formError={formError}
        />
      </DrawPanel>

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Estudiante"
        message="¿Estás seguro de que deseas eliminar este estudiante? Esta acción es irreversible y podría fallar si el estudiante tiene contratos de comodato asociados."
      />

      {/* Notificaciones flotantes */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Estudiantes;
