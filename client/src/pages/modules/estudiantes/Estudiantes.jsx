import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableB, DrawPanel, AlertModal, Button, TextField, CalendarPicker } from 'anteriority-ui';
import FormMessage from '../../../components/FormMessage';
import { Plus } from 'lucide-react';
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from '../../../services/estudiantes';
import { calcularEdad, esMenorDeEdad, esFechaFutura } from '../../../utils/edad';
import { tableColors, drawPanelColors } from '../../../theme/tokens';
import { COMMON, ESTUDIANTES as TXT } from '../../../constants/text';

const FORM_INICIAL = {
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

export default function Estudiantes() {
  const { search } = useOutletContext() ?? {};
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setEstudiantes(await getEstudiantes());
    } catch (err) {
      setError(err.message || TXT.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const esMenor = esMenorDeEdad(formData.fecha_nacimiento);

  const abrirNuevo = () => {
    setEditando(null);
    setFormData(FORM_INICIAL);
    setFormError('');
    setPanelOpen(true);
  };

  const abrirEditar = (estudiante) => {
    setEditando(estudiante);
    setFormData({
      cedula: estudiante.cedula || '',
      nombre: estudiante.nombre || '',
      apellido: estudiante.apellido || '',
      fecha_nacimiento: estudiante.fecha_nacimiento || '',
      telefono: estudiante.telefono || '',
      direccion: estudiante.direccion || '',
      rep_cedula: estudiante.representante?.cedula || '',
      rep_nombre: estudiante.representante?.nombre || '',
      rep_apellido: estudiante.representante?.apellido || '',
      rep_telefono: estudiante.representante?.telefono || '',
      rep_email: estudiante.representante?.email || '',
      rep_direccion: estudiante.representante?.direccion || '',
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

    if (esFechaFutura(formData.fecha_nacimiento)) {
      setFormError(TXT.futureBirthdateError);
      return;
    }

    setSaving(true);
    try {
      if (editando) {
        await updateEstudiante(editando.id, formData);
      } else {
        await createEstudiante(formData);
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
      await deleteEstudiante(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch (err) {
      setDeleteError(err.message || TXT.deleteError);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'nombre', label: TXT.columns.nombre, render: (row) => `${row.nombre} ${row.apellido}` },
      { key: 'cedula', label: TXT.columns.cedula, render: (row) => row.cedula || COMMON.notAvailable },
      { key: 'edad', label: TXT.columns.edad, render: (row) => calcularEdad(row.fecha_nacimiento) ?? COMMON.notAvailable },
      {
        key: 'representante',
        label: TXT.columns.representante,
        render: (row) =>
          row.representante ? `${row.representante.nombre} ${row.representante.apellido}` : TXT.columns.mayorDeEdad,
      },
      {
        key: 'actions',
        label: COMMON.actions,
        type: 'actions',
        actions: [
          { label: COMMON.edit, onClick: abrirEditar },
          { label: COMMON.delete, onClick: setAEliminar },
        ],
      },
    ],
    [],
  );

  const requiredFields = esMenor
    ? ['nombre', 'apellido', 'fecha_nacimiento', 'rep_cedula', 'rep_nombre', 'rep_apellido', 'rep_telefono', 'rep_direccion']
    : ['nombre', 'apellido', 'fecha_nacimiento'];

  const dataFiltrada = search
    ? estudiantes.filter((e) =>
        `${e.nombre} ${e.apellido} ${e.cedula ?? ''}`.toLowerCase().includes(search.toLowerCase()),
      )
    : estudiantes;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#3e2723' }}>{TXT.pageTitle}</h1>
          <p style={{ margin: '4px 0 0', color: '#8d7566' }}>{TXT.pageSubtitle}</p>
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
        {...drawPanelColors}
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editando ? TXT.editTitle : TXT.newTitle}
        description={esMenor ? TXT.minorDescription : undefined}
        showActions
        formId="form-estudiante"
        confirmText={editando ? COMMON.save : COMMON.register}
        loading={saving}
        progressMode="form"
        formData={formData}
        requiredFields={requiredFields}
      >
        <form
          id="form-estudiante"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {formError && <FormMessage type="danger">{formError}</FormMessage>}

          <TextField
           label={TXT.fields.cedula} 
           name="cedula" 
           value={formData.cedula} 
           onChange={handleChange} 
           required
           />
          <TextField label={TXT.fields.nombre}
           name="nombre"
            value={formData.nombre}
            onChange={handleChange} 
            required 
            />
          <TextField 
          label={TXT.fields.apellido}
           name="apellido" 
           value={formData.apellido}
            onChange={handleChange}
             required 
             />
          <CalendarPicker
            label={TXT.fields.fechaNacimiento}
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
            selectorsPopperZIndex={200000}
          />
          <TextField label={TXT.fields.telefono} name="telefono" value={formData.telefono} onChange={handleChange} />
          <TextField label={TXT.fields.direccion} name="direccion" value={formData.direccion} onChange={handleChange} />

          {esMenor && (
            <>
              <FormMessage type="warning">{TXT.minorWarning}</FormMessage>
              <TextField label={TXT.fields.repCedula} name="rep_cedula" value={formData.rep_cedula} onChange={handleChange} required />
              <TextField label={TXT.fields.repNombre} name="rep_nombre" value={formData.rep_nombre} onChange={handleChange} required />
              <TextField label={TXT.fields.repApellido} name="rep_apellido" value={formData.rep_apellido} onChange={handleChange} required />
              <TextField label={TXT.fields.repTelefono} name="rep_telefono" value={formData.rep_telefono} onChange={handleChange} required />
              <TextField label={TXT.fields.repEmail} name="rep_email" value={formData.rep_email} onChange={handleChange} />
              <TextField label={TXT.fields.repDireccion} name="rep_direccion" value={formData.rep_direccion} onChange={handleChange} required />
            </>
          )}
        </form>
      </DrawPanel>

      <AlertModal
        open={Boolean(aEliminar)}
        title={TXT.deleteTitle}
        message={deleteError || (aEliminar && TXT.deleteConfirm(aEliminar.nombre, aEliminar.apellido))}
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
