import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { Edit, Trash } from 'lucide-react';
import EmptyState from './illustrations/EmptyState';
import ColorDot from './ColorDot';

const InstrumentoTable = ({ instrumentos, onEdit, onDelete }) => {
  const getConservacionColor = (status) => {
    switch (status) {
      case 'NUEVO': return 'success';
      case 'BUENO': return 'primary';
      case 'REGULAR': return 'warning';
      case 'MALO': return 'error';
      default: return 'default';
    }
  };

  const getDisponibilidadColor = (status) => {
    switch (status) {
      case 'DISPONIBLE': return 'success';
      case 'PRESTADO': return 'info';
      case 'MANTENIMIENTO': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell><Typography fontWeight="bold">Código</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Nombre</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Marca / Modelo</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Nro Serie</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Conservación</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Disponibilidad</Typography></TableCell>
            <TableCell align="right"><Typography fontWeight="bold">Acciones</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instrumentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <EmptyState
                  title="No hay instrumentos que coincidan"
                  subtitle="Ajusta los filtros de búsqueda o registra un nuevo instrumento en el inventario."
                />
              </TableCell>
            </TableRow>
          ) : (
            instrumentos.map((inst) => (
              <TableRow key={inst.id} hover>
                <TableCell>{inst.codigo_inventario}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">{inst.nombre}</Typography>
                  {inst.accesorios && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Accs: {inst.accesorios}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {inst.marca || '-'} {inst.modelo ? `/ ${inst.modelo}` : ''}
                  </Typography>
                  {(inst.medida || inst.color) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {inst.medida && (
                        <Typography variant="caption" color="text.secondary">
                          Medida: {inst.medida}
                        </Typography>
                      )}
                      {inst.medida && inst.color && (
                        <Typography variant="caption" color="text.secondary">|</Typography>
                      )}
                      {inst.color && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-block', mr: 0.2 }}>Color:</Typography>
                          <ColorDot color={inst.color} />
                        </Box>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>{inst.numero_serie || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={inst.estado_conservacion}
                    size="small"
                    color={getConservacionColor(inst.estado_conservacion)}
                    variant="light"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={inst.estado_disponibilidad}
                    size="small"
                    color={getDisponibilidadColor(inst.estado_disponibilidad)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(inst)} size="small" sx={{ mr: 1 }}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(inst.id)}
                    disabled={inst.estado_disponibilidad === 'PRESTADO'}
                    size="small"
                  >
                    <Trash size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InstrumentoTable;
