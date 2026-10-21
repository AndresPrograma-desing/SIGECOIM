import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableB, DrawPanel, AlertModal, Button, TextField, Selector, CalendarPicker, MultilinePlaceholder } from 'anteriority-ui';
import FormMessage from '../../../components/FormMessage';
import { Plus } from 'lucide-react';
import { getComodatos, createComodato, updateComodato, deleteComodato, registrarDevolucion } from '../../../services/comodatos';
import { getEstudiantes } from '../../../services/estudiantes';
import { getInstrumentos } from '../../../services/instrumentos';
import { esMenorDeEdad } from '../../../utils/edad';
import { tableColors } from '../../../theme/tokens';
import { COMMON, COMODATOS as TXT, INSTRUMENTOS } from '../../../constants/text';

const FORM_INICIAL = {
  folio_contrato: '',
  fecha_inicio: '',
  fecha_devolucion_prevista: '',
  estudiante_id: '',
  instrumento_id: '',
};

function badgeTypeEstado(row) {
  if (row.estado === 'ACTIVO') return 'success';
  if (row.estado === 'VENCIDO') return 'danger';
  return 'warning';
}

export default function Comodatos() {
  const { search } = useOutletContext() ?? {};
  const [comodatos, setComodatos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const [devolucionDe, setDevolucionDe] = useState(null);
  const [devolucionData, setDevolucionData] = useState({ estado_instrumento_recibido: 'BUENO', observaciones: '' });
  const [devolucionError, setDevolucionError] = useState('');
  const [devolviendo, setDevolviendo] = useState(false);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [comodatosData, estudiantesData, instrumentosData] = await Promise.all([
        getComodatos(),
        getEstudiantes(),
        getInstrumentos(),
      ]);
      setComodatos(comodatosData);
      setEstudiantes(estudiantesData);
      setInstrumentos(instrumentosData);
    } catch (err) {
      setError(err.message || TXT.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const estudianteSeleccionado = estudiantes.find((e) => String(e.id) === String(formData.estudiante_id));

  const opcionesEstudiantes = estudiantes.map((e) => ({ value: e.id, label: `${e.nombre} ${e.apellido}` }));
  const opcionesInstrumentos = instrumentos
    .filter((i) => i.estado_disponibilidad === 'DISPONIBLE' || i.id === editando?.instrumento_id)
    .map((i) => ({ value: i.id, label: `${i.nombre} (${i.codigo_inventario})` }));

  const abrirNuevo = () => {
    setEditando(null);
    setFormData(FORM_INICIAL);
    setFormError('');
    setPanelOpen(true);
  };

  const abrirEditar = (comodato) => {
    setEditando(comodato);
    setFormData({
      folio_contrato: comodato.folio_contrato || '',
      fecha_inicio: comodato.fecha_inicio || '',
      fecha_devolucion_prevista: comodato.fecha_devolucion_prevista || '',
      estudiante_id: comodato.estudiante_id || '',
      instrumento_id: comodato.instrumento_id || '',
    });
    setFormError('');
    setPanelOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editando) {
        await updateComodato(editando.id, formData);
      } else {
        await createComodato(formData);
      }
      setPanelOpen(false);
      await cargar();
    } catch (err) {
      setFormError(err.message || TXT.saveError);
    } finally {
      setSaving(false);
    }
  };

  const confirmarEliminar = async () => {
    setDeleteError('');
    try {
      await deleteComodato(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch (err) {
      setDeleteError(err.message || TXT.deleteError);
    }
  };

  const abrirDevolucion = (comodato) => {
    setDevolucionDe(comodato);
    setDevolucionData({ estado_instrumento_recibido: comodato.instrumento?.estado_conservacion || 'BUENO', observaciones: '' });
    setDevolucionError('');
  };

  const confirmarDevolucion = async (e) => {
    e.preventDefault();
    setDevolucionError('');
    setDevolviendo(true);
    try {
      await registrarDevolucion(devolucionDe.id, devolucionData);
      setDevolucionDe(null);
      await cargar();
    } catch (err) {
      setDevolucionError(err.message || TXT.devolucionError);
    } finally {
      setDevolviendo(false);
    }
  };

  const dataFiltrada = comodatos
    .filter((c) => !filtroEstado || c.estado === filtroEstado)
    .filter((c) =>
      !search ||
      `${c.folio_contrato} ${c.estudiante?.nombre ?? ''} ${c.estudiante?.apellido ?? ''} ${c.instrumento?.nombre ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const columns = useMemo(
    () => [
      { key: 'folio_contrato', label: TXT.columns.correlativo },
      {
        key: 'estudiante',
        label: TXT.columns.estudiante,
        render: (row) => `${row.estudiante?.nombre ?? ''} ${row.estudiante?.apellido ?? ''}`.trim() || COMMON.notAvailable,
      },
      { key: 'instrumento', label: TXT.columns.instrumento, render: (row) => row.instrumento?.nombre || COMMON.notAvailable },
      { key: 'fecha_devolucion_prevista', label: TXT.columns.devolucionPrevista },
      {
        key: 'estado',
        label: TXT.columns.estado,
        type: 'badge',
        badgeType: badgeTypeEstado,
        filter: {
          options: [{ value: '', label: COMMON.all }, ...TXT.estados],
          value: filtroEstado,
          onChange: setFiltroEstado,
        },
      },
      {
        key: 'actions',
        label: COMMON.actions,
        type: 'actions',
        actions: [
          { label: TXT.registrarDevolucion, onClick: abrirDevolucion, disabled: (row) => row.estado !== 'ACTIVO' },
          { label: COMMON.edit, onClick: abrirEditar, disabled: (row) => row.estado !== 'ACTIVO' },
          { label: COMMON.delete, onClick: setAEliminar },
        ],
      },
    ],
    [filtroEstado],
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#0b3558' }}>{TXT.pageTitle}</h1>
          <p style={{ margin: '4px 0 0', color: '#476788' }}>{TXT.pageSubtitle}</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={abrirNuevo}>
          {TXT.newButton}
        </Button>
      </div>

      <TableB
        columns={columns}
        data={dataFiltrada}
        rowKey="id"
        loading={loading}
        error={error}
        onRetry={cargar}
        emptyMessage={TXT.emptyMessage}
        scrollFooter
        {...tableColors}
      />

      <DrawPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editando ? TXT.editTitle : TXT.newTitle}
        showActions
        formId="form-comodato"
        confirmText={editando ? COMMON.save : COMMON.register}
        loading={saving}
        progressMode="form"
        formData={formData}
        requiredFields={['folio_contrato', 'fecha_devolucion_prevista', 'estudiante_id', 'instrumento_id']}
      >
        <form
          id="form-comodato"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {formError && <FormMessage type="danger">{formError}</FormMessage>}

          <TextField
            label={TXT.fields.folioContrato}
            name="folio_contrato"
            value={formData.folio_contrato}
            onChange={handleChange}
            required
            placeholder={TXT.fields.folioPlaceholder}
          />

          <Selector
            label={TXT.fields.estudiante}
            options={opcionesEstudiantes}
            value={formData.estudiante_id}
            onChange={(e) => handleChange({ target: { name: 'estudiante_id', value: e.target.value } })}
            required
          />

          {estudianteSeleccionado && (
            <FormMessage type={esMenorDeEdad(estudianteSeleccionado.fecha_nacimiento) ? 'warning' : 'default'}>
              {esMenorDeEdad(estudianteSeleccionado.fecha_nacimiento)
                ? TXT.menorConRepresentante(estudianteSeleccionado.representante?.nombre, estudianteSeleccionado.representante?.apellido)
                : TXT.mayorDeEdad}
            </FormMessage>
          )}

          <Selector
            label={TXT.fields.instrumento}
            options={opcionesInstrumentos}
            value={formData.instrumento_id}
            onChange={(e) => handleChange({ target: { name: 'instrumento_id', value: e.target.value } })}
            required
          />

          <CalendarPicker
            label={TXT.fields.fechaInicio}
            name="fecha_inicio"
            value={formData.fecha_inicio}
            onChange={handleChange}
          />
          <CalendarPicker
            label={TXT.fields.fechaDevolucionPrevista}
            name="fecha_devolucion_prevista"
            value={formData.fecha_devolucion_prevista}
            onChange={handleChange}
            required
          />
        </form>
      </DrawPanel>

      <DrawPanel
        isOpen={Boolean(devolucionDe)}
        onClose={() => setDevolucionDe(null)}
        title={TXT.devolucionTitle}
        description={devolucionDe ? TXT.devolucionDescription(devolucionDe.folio_contrato, devolucionDe.instrumento?.nombre) : ''}
        showActions
        formId="form-devolucion"
        confirmText={TXT.devolucionConfirm}
        loading={devolviendo}
      >
        <form
          id="form-devolucion"
          onSubmit={confirmarDevolucion}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {devolucionError && <FormMessage type="danger">{devolucionError}</FormMessage>}

          <Selector
            label={TXT.fields.estadoInstrumentoRecibido}
            options={INSTRUMENTOS.estadosConservacion}
            value={devolucionData.estado_instrumento_recibido}
            onChange={(e) => setDevolucionData((prev) => ({ ...prev, estado_instrumento_recibido: e.target.value }))}
            required
          />
          <MultilinePlaceholder
            label={TXT.fields.observaciones}
            value={devolucionData.observaciones}
            onChange={(e) => setDevolucionData((prev) => ({ ...prev, observaciones: e.target.value }))}
            rows={4}
          />
        </form>
      </DrawPanel>

      <AlertModal
        open={Boolean(aEliminar)}
        title={TXT.deleteTitle}
        message={deleteError || (aEliminar && TXT.deleteConfirm(aEliminar.folio_contrato, aEliminar.estado === 'ACTIVO'))}
        confirmText={COMMON.delete}
        cancelText={COMMON.cancel}
        onClose={() => {
          setAEliminar(null);
          setDeleteError('');
        }}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
