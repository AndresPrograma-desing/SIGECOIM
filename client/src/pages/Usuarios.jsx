import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Snackbar, Button } from '@mui/material';
import { UserPlus } from 'lucide-react';
import api from '../services/api';
import UsuarioTable from '../components/UsuarioTable';
import UsuarioForm from '../components/UsuarioForm';
import DrawPanel from '../components/DrawPanel';
import ConfirmDialog from '../components/ConfirmDialog';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado del DrawPanel
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'COORDINADOR',
  });
  const [formError, setFormError] = useState('');

  // Notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo obtener la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [editingUsuario, setEditingUsuario] = useState(null);

  const handleOpenEdit = (usr) => {
    setEditingUsuario(usr);
    setFormData({
      nombre: usr.nombre,
      email: usr.email,
      password: '',
      rol: usr.rol,
    });
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingUsuario(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'COORDINADOR' });
    setFormError('');
    setIsDrawOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password, rol } = formData;

    if (!nombre.trim() || !email.trim() || (!editingUsuario && !password)) {
      setFormError('Nombre, email y contraseña son obligatorios.');
      return;
    }

    try {
      if (editingUsuario) {
        await api.put(`/usuarios/${editingUsuario.id}`, { nombre, email, password, rol });
        showNotification('Usuario actualizado exitosamente.', 'success');
      } else {
        await api.post('/usuarios', { nombre, email, password, rol });
        showNotification('Usuario creado exitosamente.', 'success');
      }
      setIsDrawOpen(false);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Ocurrió un error al guardar el usuario.');
    }
  };

  const handleToggleState = async (id) => {
    try {
      const res = await api.put(`/usuarios/${id}/toggle`);
      showNotification(res.data.message, 'success');
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      showNotification('No se pudo cambiar el estado del usuario.', 'error');
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return;
    try {
      const res = await api.delete(`/usuarios/${confirmDialog.id}`);
      showNotification(res.data.message, 'success');
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'No se pudo eliminar el usuario.', 'error');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* Cabecera */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justify: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4">Gestión de Usuarios del Sistema</Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={handleOpenCreate}
          sx={{
            px: 3,
            py: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <UsuarioTable usuarios={usuarios} onToggleState={handleToggleState} onEdit={handleOpenEdit} onDelete={handleDeleteClick} />
        </Box>
      )}

      {/* Drawer flotante para Registrar/Editar Usuario */}
      <DrawPanel
        width={500}
        open={isDrawOpen}
        onClose={() => setIsDrawOpen(false)}
        title={editingUsuario ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        onSubmit={handleSubmit}
      >
        <UsuarioForm
          formData={formData}
          onChangeForm={handleChangeForm}
          formError={formError}
          isEdit={!!editingUsuario}
        />
      </DrawPanel>

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar permanentemente este usuario? Esta acción no se puede deshacer."
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

export default Usuarios;
