import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Chip, 
  IconButton, 
  Divider, 
  Dialog, 
  DialogContent,
  InputAdornment
} from '@mui/material';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const SEMI = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        setViewDate(new Date(year, month, day));
      }
    }
  }, [value, isOpen]);

  const formatDateToShow = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
  };

  const handleDateSelect = (day) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handlePreset = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ isDummy: true, key: `dummy-${i}` });
  }
  for (let day = 1; day <= totalDays; day++) {
    cells.push({ isDummy: false, day, key: `day-${day}` });
  }

  const isSelected = (day) => {
    if (!value) return false;
    const parts = value.split('-');
    if (parts.length !== 3) return false;
    return (
      parseInt(parts[0]) === year &&
      parseInt(parts[1]) === month + 1 &&
      parseInt(parts[2]) === day
    );
  };

  return (
    <>
      {/* Input de MUI en lugar del input nativo */}
      <TextField
        label="Fecha de Devolución Prevista *"
        value={formatDateToShow(value)}
        onClick={() => setIsOpen(true)}
        placeholder="Seleccione una fecha..."
        fullWidth
        required
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
          sx: { cursor: 'pointer' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setIsOpen(true)} edge="end" size="small">
                <CalendarIcon size={18} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Modal / Dialog para el Calendario */}
      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogContent>
          {/* Cabecera del Calendario */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton size="small" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={20} />
            </IconButton>
            <Typography variant="h6">
              {monthNames[month]} {year}
            </Typography>
            <IconButton size="small" onClick={() => changeMonth(1)}>
              <ChevronRight size={20} />
            </IconButton>
          </Box>

          {/* Días de la Semana */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1, textAlign: 'center' }}>
            {weekDays.map((d) => (
              <Typography key={d} variant="caption" fontWeight="bold" color="text.secondary">
                {d}
              </Typography>
            ))}
          </Box>

          {/* Cuadrícula de Días */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 3 }}>
            {cells.map((cell) => {
              if (cell.isDummy) {
                return <Box key={cell.key} />;
              }

              const selected = isSelected(cell.day);

              return (
                <Box
                  key={cell.key}
                  onClick={() => handleDateSelect(cell.day)}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px', // Bordes más suaves
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: selected ? 'bold' : '500',
                    backgroundColor: selected ? 'secondary.main' : 'transparent',
                    color: selected ? 'secondary.contrastText' : 'text.primary',
                    '&:hover': {
                      backgroundColor: selected ? 'secondary.dark' : 'action.hover',
                    },
                  }}
                >
                  {cell.day}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Plazos rápidos */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5} fontWeight="600">
              Establecer plazo rápido:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="1 Sem"
                variant="outlined"
                onClick={() => handlePreset(7)}
                sx={{ borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              />
              <Chip
                label="15 Días"
                variant="outlined"
                onClick={() => handlePreset(15)}
                sx={{ borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              />
              <Chip
                label="1 Mes"
                variant="outlined"
                onClick={() => handlePreset(30)}
                sx={{ borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              />
              <Chip
                label="3 Meses"
                variant="outlined"
                onClick={() => handlePreset(90)}
                sx={{ borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SEMI;