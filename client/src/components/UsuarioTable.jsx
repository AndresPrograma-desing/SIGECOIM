import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { Shield, ShieldAlert, Power, Edit, Trash } from 'lucide-react';
import EmptyState from './illustrations/EmptyState';

const UsuarioTable = ({ usuarios, onToggleState, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Correo Electrónico</TableCell>
            <TableCell>Rol de Acceso</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState title="No hay usuarios registrados" subtitle="Crea el primer usuario del sistema con el botón «Nuevo Usuario»." />
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usr) => {
              const isAdmin = usr.rol === 'ADMINISTRADOR';
              const initials = usr.nombre
                ? usr.nombre
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'US';

              return (
                <TableRow key={usr.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          backgroundColor: isAdmin ? 'primary.main' : 'secondary.main',
                          color: isAdmin ? '#ffffff' : 'secondary.contrastText',
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Typography fontWeight="600" color="text.primary">
                        {usr.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{usr.email}</TableCell>
                  <TableCell>
                    <Chip
                      icon={isAdmin ? <Shield size={14} /> : <ShieldAlert size={14} />}
                      label={isAdmin ? 'ADMINISTRADOR' : 'COORDINADOR'}
                      size="small"
                      sx={{
                        backgroundColor: isAdmin ? 'primary.main' : 'warning.light',
                        color: isAdmin ? '#ffffff' : 'warning.dark',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: isAdmin ? '#ffffff' : 'warning.dark',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={usr.estado ? 'ACTIVO' : 'INACTIVO'}
                      size="small"
                      color={usr.estado ? 'success' : 'error'}
                      variant={usr.estado ? 'contained' : 'outlined'}
                      sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar Usuario">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(usr)}
                        color="primary"
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mr: 1 }}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={usr.estado ? 'Desactivar Usuario' : 'Activar Usuario'}>
                      <IconButton
                        size="small"
                        onClick={() => onToggleState(usr.id)}
                        color={usr.estado ? 'warning' : 'success'}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mr: 1 }}
                      >
                        <Power size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Usuario">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(usr.id)}
                        color="error"
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                      >
                        <Trash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsuarioTable;
