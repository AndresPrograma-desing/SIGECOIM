import { useEffect, useRef, useState } from 'react';
import { TextField, CalendarPicker } from 'anteriority-ui';
import { CalendarDays } from 'lucide-react';

// El CalendarPicker de anteriority-ui fuerza readOnly en su input, así que no
// permite escribir la fecha. Este campo muestra un input editable (dd/mm/aaaa)
// y reutiliza el CalendarPicker solo como popover: su propio input se oculta y
// se abre desde el ícono del calendario.

const isoADisplay = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
};

// Devuelve 'YYYY-MM-DD' si el texto es una fecha real completa; si no, null.
const displayAIso = (texto) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!match) return null;
  const [, dd, mm, aaaa] = match;
  const fecha = new Date(Number(aaaa), Number(mm) - 1, Number(dd));
  const valida =
    fecha.getFullYear() === Number(aaaa) &&
    fecha.getMonth() === Number(mm) - 1 &&
    fecha.getDate() === Number(dd);
  return valida ? `${aaaa}-${mm}-${dd}` : null;
};

const aplicarMascara = (crudo) => {
  const digitos = crudo.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

const OCULTAR_INPUT_NATIVO = { display: 'none' };

export default function DateField({ label, name, value, onChange, required, disabled, selectorsPopperZIndex, ...rest }) {
  const [texto, setTexto] = useState(isoADisplay(value));
  const [tocado, setTocado] = useState(false);
  const pickerRef = useRef(null);

  // Sincroniza cuando el valor cambia desde afuera (calendario, reset del form, edición).
  useEffect(() => {
    if ((displayAIso(texto) || '') !== (value || '')) setTexto(isoADisplay(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emitir = (nuevoValor) => onChange({ target: { name, value: nuevoValor, type: 'date' } });

  const handleTexto = (e) => {
    const nuevo = aplicarMascara(e.target.value);
    setTexto(nuevo);
    emitir(displayAIso(nuevo) || '');
  };

  const abrirCalendario = () => {
    if (disabled) return;
    pickerRef.current?.querySelector('input')?.click();
  };

  const invalido = tocado && texto !== '' && displayAIso(texto) === null;

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        label={label}
        name={name}
        value={texto}
        onChange={handleTexto}
        onBlur={() => setTocado(true)}
        placeholder="dd/mm/aaaa"
        required={required}
        disabled={disabled}
        error={invalido ? 'Fecha inválida (dd/mm/aaaa)' : undefined}
        autoComplete="off"
        slotProps={{
          htmlInput: { inputMode: 'numeric', maxLength: 10 },
          input: {
            endAdornment: (
              <CalendarDays
                size={16}
                style={{ cursor: disabled ? 'default' : 'pointer', color: '#64748b' }}
                onClick={abrirCalendario}
              />
            ),
          },
        }}
        {...rest}
      />
      <div ref={pickerRef} style={{ height: 0 }}>
        <CalendarPicker
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          inputSx={OCULTAR_INPUT_NATIVO}
          selectorsPopperZIndex={selectorsPopperZIndex}
        />
      </div>
    </div>
  );
}
