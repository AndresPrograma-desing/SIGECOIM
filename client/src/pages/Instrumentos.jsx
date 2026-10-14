import { useEffect, useMemo, useState } from 'react';
import { TableB, DrawPanel, AlertModal, Button, TextField, Selector, Barnner } from 'anteriority-ui';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getInstrumentos, createInstrumento, updateInstrumento, deleteInstrumento } from '../services/instrumentos';
import { tableColors } from '../theme/tokens';
import { COMMON, INSTRUMENTOS as TXT } from '../constants/text';

const FORM_INICIAL = {
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
};

function badgeTypeDisponibilidad(row) {
  if (row.estado_disponibilidad === 'DISPONIBLE') return 'success';
  if (row.estado_disponibilidad === 'MANTENIMIENTO') return 'warning';
  return 'danger';
}

export default function Instrumentos() {
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      setInstrumentos(await getInstrumentos());
    } catch (err) {
      setError(err.message || TXT.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setFormData(FORM_INICIAL);
    setFormError('');
    setPanelOpen(true);
  };

  const abrirEditar = (instrumento) => {
    setEditando(instrumento);
    setFormData({
      codigo_inventario: instrumento.codigo_inventario || '',
      nombre: instrumento.nombre || '',
      marca: instrumento.marca || '',
      modelo: instrumento.modelo || '',
      numero_serie: instrumento.numero_serie || '',
      medida: instrumento.medida || '',
      color: instrumento.color || '',
      accesorios: instrumento.accesorios || '',
      estado_conservacion: instrumento.estado_conservacion || 'BUENO',
      estado_disponibilidad: instrumento.estado_disponibilidad || 'DISPONIBLE',
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
        await updateInstrumento(editando.id, formData);
      } else {
        await createInstrumento(formData);
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
      await deleteInstrumento(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch (err) {
      setDeleteError(err.message || TXT.deleteError);
    }
  };

  const dataFiltrada = filtroDisponibilidad
    ? instrumentos.filter((i) => i.estado_disponibilidad === filtroDisponibilidad)
    : instrumentos;

  const columns = useMemo(
    () => [
      { key: 'codigo_inventario', label: TXT.columns.codigo },
      { key: 'nombre', label: TXT.columns.instrumento, render: (row) => `${row.nombre}${row.marca ? ` — ${row.marca}` : ''}` },
      { key: 'medida', label: TXT.columns.medida, render: (row) => row.medida || COMMON.notAvailable },
      { key: 'estado_conservacion', label: TXT.columns.conservacion },
      {
        key: 'estado_disponibilidad',
        label: TXT.columns.disponibilidad,
        type: 'badge',
        badgeType: badgeTypeDisponibilidad,
        filter: {
          options: [{ value: '', label: COMMON.all }, ...TXT.estadosDisponibilidad],
          value: filtroDisponibilidad,
          onChange: setFiltroDisponibilidad,
        },
      },
      {
        key: 'actions',
        label: COMMON.actions,
        type: 'actions',
        actions: [
          { label: COMMON.edit, icon: Pencil, onClick: abrirEditar },
          { label: COMMON.delete, icon: Trash2, onClick: setAEliminar },
        ],
      },
    ],
    [filtroDisponibilidad],
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
        {...tableColors}
      />

      <DrawPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editando ? TXT.editTitle : TXT.newTitle}
        showActions
        formId="form-instrumento"
        confirmText={editando ? COMMON.save : COMMON.register}
        loading={saving}
        progressMode="form"
        formData={formData}
        requiredFields={['codigo_inventario', 'nombre']}
      >
        <form
          id="form-instrumento"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {formError && <Barnner type="danger">{formError}</Barnner>}

          <TextField label={TXT.fields.codigoInventario} name="codigo_inventario" value={formData.codigo_inventario} onChange={handleChange} required />
          <TextField label={TXT.fields.nombre} name="nombre" value={formData.nombre} onChange={handleChange} required />
          <TextField label={TXT.fields.marca} name="marca" value={formData.marca} onChange={handleChange} />
          <TextField label={TXT.fields.modelo} name="modelo" value={formData.modelo} onChange={handleChange} />
          <TextField label={TXT.fields.numeroSerie} name="numero_serie" value={formData.numero_serie} onChange={handleChange} />
          <TextField label={TXT.fields.medida} name="medida" value={formData.medida} onChange={handleChange} placeholder={TXT.fields.medidaPlaceholder} />
          <TextField label={TXT.fields.color} name="color" value={formData.color} onChange={handleChange} />
          <TextField label={TXT.fields.accesorios} name="accesorios" value={formData.accesorios} onChange={handleChange} placeholder={TXT.fields.accesoriosPlaceholder} />
          <Selector
            label={TXT.fields.estadoConservacion}
            options={TXT.estadosConservacion}
            value={formData.estado_conservacion}
            onChange={(e) => handleChange({ target: { name: 'estado_conservacion', value: e.target.value } })}
          />
          <Selector
            label={TXT.fields.disponibilidad}
            options={TXT.estadosDisponibilidad}
            value={formData.estado_disponibilidad}
            onChange={(e) => handleChange({ target: { name: 'estado_disponibilidad', value: e.target.value } })}
          />
        </form>
      </DrawPanel>

      <AlertModal
        open={Boolean(aEliminar)}
        title={TXT.deleteTitle}
        message={deleteError || (aEliminar && TXT.deleteConfirm(aEliminar.nombre))}
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
