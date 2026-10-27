import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableB, DrawPanel, AlertModal, Button, TextField, Selector, Badge } from 'anteriority-ui';
import { Plus, LayoutGrid, MapPin, PackageCheck } from 'lucide-react';
import FormMessage from '../../../components/FormMessage';
import {
  getInstrumentos,
  createInstrumento,
  updateInstrumento,
  deleteInstrumento,
  getStockPorTipo,
  getHistorialUbicacion,
} from '../../../services/instrumentos';
import { tableColors, drawPanelColors } from '../../../theme/tokens';
import { COMMON, INSTRUMENTOS as TXT } from '../../../constants/text';

const FORM_INICIAL = {
  codigo_inventario: '',
  nombre: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  medida: '',
  color: '',
  accesorios: '',
  tipo: '',
  ubicacion: '',
  estado_conservacion: 'BUENO',
  estado_disponibilidad: 'DISPONIBLE',
};

// Familia y subfamilia son solo guías de captura (no se envían al backend):
// ayudan a elegir el nombre del instrumento desde la lista típica de su subfamilia.
const SELECTOR_INICIAL = { familia: '', subfamilia: '' };

function badgeTypeDisponibilidad(row) {
  if (row.estado_disponibilidad === 'DISPONIBLE') return 'success';
  if (row.estado_disponibilidad === 'MANTENIMIENTO') return 'warning';
  return 'danger';
}

export default function Instrumentos() {
  const { search } = useOutletContext() ?? {};
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [selectorData, setSelectorData] = useState(SELECTOR_INICIAL);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [aEliminar, setAEliminar] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const [historialDe, setHistorialDe] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState('');

  const [stockOpen, setStockOpen] = useState(false);
  const [stock, setStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState('');

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
    setSelectorData(SELECTOR_INICIAL);
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
      tipo: instrumento.tipo || '',
      ubicacion: instrumento.ubicacion || '',
      estado_conservacion: instrumento.estado_conservacion || 'BUENO',
      estado_disponibilidad: instrumento.estado_disponibilidad || 'DISPONIBLE',
    });
    setSelectorData(SELECTOR_INICIAL);
    setFormError('');
    setPanelOpen(true);
  };

  const abrirHistorial = async (instrumento) => {
    setHistorialDe(instrumento);
    setHistorialError('');
    setHistorialLoading(true);
    try {
      setHistorial(await getHistorialUbicacion(instrumento.id));
    } catch (err) {
      setHistorialError(err.message || TXT.loadError);
    } finally {
      setHistorialLoading(false);
    }
  };

  const abrirStock = async () => {
    setStockOpen(true);
    setStockError('');
    setStockLoading(true);
    try {
      setStock(await getStockPorTipo());
    } catch (err) {
      setStockError(err.message || TXT.loadError);
    } finally {
      setStockLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFamiliaChange = (e) => {
    const familia = e.target.value;
    const familiaData = TXT.familias.find((f) => f.value === familia);
    // Si la familia tiene una sola subfamilia (ej. Viento-Madera), se autoselecciona
    // para mostrar de inmediato la lista de instrumentos típicos.
    const subfamilia = familiaData?.subfamilias.length === 1 ? familiaData.subfamilias[0].value : '';
    setSelectorData({ familia, subfamilia });
  };

  const handleSubfamiliaChange = (e) => {
    setSelectorData((prev) => ({ ...prev, subfamilia: e.target.value }));
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

  const dataFiltrada = instrumentos
    .filter((i) => !filtroDisponibilidad || i.estado_disponibilidad === filtroDisponibilidad)
    .filter((i) =>
      !search || `${i.nombre} ${i.marca ?? ''} ${i.codigo_inventario}`.toLowerCase().includes(search.toLowerCase()),
    );

  const opcionesFamilias = TXT.familias.map(({ value, label }) => ({ value, label }));

  const familiaSeleccionada = TXT.familias.find((f) => f.value === selectorData.familia);
  const opcionesSubfamilias = (familiaSeleccionada?.subfamilias ?? []).map(({ value, label }) => ({ value, label }));

  const subfamiliaSeleccionada = familiaSeleccionada?.subfamilias.find((s) => s.value === selectorData.subfamilia);
  const opcionesInstrumentosTipicos = (subfamiliaSeleccionada?.instrumentos ?? []).map((nombre) => ({
    value: nombre,
    label: nombre,
  }));

  const columns = useMemo(
    () => [
      { key: 'codigo_inventario', label: TXT.columns.codigo },
      { key: 'nombre', label: TXT.columns.instrumento, render: (row) => `${row.nombre}${row.marca ? ` — ${row.marca}` : ''}` },
      { key: 'medida', label: TXT.columns.medida, render: (row) => row.medida || COMMON.notAvailable },
      { key: 'ubicacion', label: TXT.columns.ubicacion, render: (row) => row.ubicacion || COMMON.notAvailable },
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
          { label: TXT.historialUbicacionAction, onClick: abrirHistorial },
          { label: COMMON.edit, onClick: abrirEditar },
          { label: COMMON.delete, onClick: setAEliminar },
        ],
      },
    ],
    [filtroDisponibilidad],
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#3e2723' }}>{TXT.pageTitle}</h1>
          <p style={{ margin: '4px 0 0', color: '#8d7566' }}>{TXT.pageSubtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" icon={LayoutGrid} onClick={abrirStock}>
            {TXT.stockPorTipoAction}
          </Button>
          <Button variant="primary" icon={Plus} onClick={abrirNuevo}>
            {TXT.newButton}
          </Button>
        </div>
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
        {...drawPanelColors}
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
          {formError && <FormMessage type="danger">{formError}</FormMessage>}

          <TextField label={TXT.fields.codigoInventario} name="codigo_inventario" value={formData.codigo_inventario} onChange={handleChange} required />

          <Selector
            label={TXT.fields.familia}
            options={opcionesFamilias}
            value={selectorData.familia}
            onChange={handleFamiliaChange}
          />

          {opcionesSubfamilias.length > 1 && (
            <Selector
              label={TXT.fields.subfamilia}
              options={opcionesSubfamilias}
              value={selectorData.subfamilia}
              onChange={handleSubfamiliaChange}
            />
          )}

          {opcionesInstrumentosTipicos.length > 0 ? (
            <Selector
              label={TXT.fields.nombre}
              options={opcionesInstrumentosTipicos}
              value={formData.nombre}
              onChange={(e) => handleChange({ target: { name: 'nombre', value: e.target.value } })}
              required
            />
          ) : (
            <TextField label={TXT.fields.nombre} name="nombre" value={formData.nombre} onChange={handleChange} required />
          )}
          <TextField label={TXT.fields.marca} name="marca" value={formData.marca} onChange={handleChange} placeholder={TXT.fields.marcaPlaceholder} />
          <TextField label={TXT.fields.modelo} name="modelo" value={formData.modelo} onChange={handleChange} />
          <TextField label={TXT.fields.numeroSerie} name="numero_serie" value={formData.numero_serie} onChange={handleChange} />
          <TextField label={TXT.fields.medida} name="medida" value={formData.medida} onChange={handleChange} placeholder={TXT.fields.medidaPlaceholder} />
          <TextField label={TXT.fields.color} name="color" value={formData.color} onChange={handleChange} />
          <TextField label={TXT.fields.accesorios} name="accesorios" value={formData.accesorios} onChange={handleChange} placeholder={TXT.fields.accesoriosPlaceholder} />
          <Selector
            label={TXT.fields.tipo}
            options={TXT.tiposInstrumento}
            value={formData.tipo}
            onChange={(e) => handleChange({ target: { name: 'tipo', value: e.target.value } })}
          />
          <TextField label={TXT.fields.ubicacion} name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder={TXT.fields.ubicacionPlaceholder} />
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

      <DrawPanel
        {...drawPanelColors}
        isOpen={Boolean(historialDe)}
        onClose={() => setHistorialDe(null)}
        title={TXT.historialUbicacionTitle}
        description={historialDe ? `${historialDe.nombre} — ${historialDe.codigo_inventario}` : ''}
      >
        {historialError && <FormMessage type="danger">{historialError}</FormMessage>}
        {!historialLoading && !historialError && historial.length === 0 && (
          <p style={{ color: '#8d7566', fontSize: 14 }}>{TXT.historialUbicacionEmpty}</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {historial.map((h) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <MapPin size={18} color="#3e2723" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, color: '#3e2723', fontWeight: 600 }}>
                  {h.ubicacion_anterior || COMMON.notAvailable} → {h.ubicacion_nueva}
                </div>
                <div style={{ fontSize: 12, color: '#8d7566' }}>
                  {h.fecha} — {TXT.historialUbicacionColumns.usuario}: {h.usuario?.nombre || COMMON.notAvailable}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawPanel>

      <DrawPanel
        {...drawPanelColors}
        isOpen={stockOpen}
        onClose={() => setStockOpen(false)}
        title={TXT.stockPorTipoTitle}
      >
        {stockError && <FormMessage type="danger">{stockError}</FormMessage>}
        {!stockLoading && !stockError && stock.length === 0 && (
          <p style={{ color: '#8d7566', fontSize: 14 }}>{TXT.stockPorTipoEmpty}</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stock.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PackageCheck size={18} color="#3e2723" />
                <span style={{ fontSize: 14, color: '#3e2723', fontWeight: 600 }}>
                  {row.tipo || TXT.stockPorTipoSinClasificar}
                </span>
              </div>
              <Badge label={row.estado_disponibilidad} value={row.total} />
            </div>
          ))}
        </div>
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
