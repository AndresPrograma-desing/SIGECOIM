import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TableB, DrawPanel, AlertModal, Button, TextField, Selector, Swich } from 'anteriority-ui';
import FormMessage from '../../../components/FormMessage';
import { Plus } from 'lucide-react';
import { getUsuarios, createUsuario, updateUsuario, toggleEstadoUsuario, deleteUsuario } from '../../../services/usuarios';
import { tableColors, drawPanelColors } from '../../../theme/tokens';
import { COMMON, USUARIOS as TXT } from '../../../constants/text';

const ADMIN_EMAIL = 'admin@sigecoim.com';

const FORM_INICIAL = {
  nombre: '',
  email: '',
  password: '',
  rol: 'COORDINADOR',
};

export default function Usuarios() {
  const { search } = useOutletContext() ?? {};
  const [usuarios, setUsuarios] = useState([]);
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
      setUsuarios(await getUsuarios());
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

  const abrirEditar = (usuario) => {
    setEditando(usuario);
    setFormData({ nombre: usuario.nombre || '', email: usuario.email || '', password: '', rol: usuario.rol || 'COORDINADOR' });
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
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateUsuario(editando.id, payload);
      } else {
        await createUsuario(formData);
      }
      setPanelOpen(false);
      await cargar();
    } catch (err) {
      setFormError(err.message || TXT.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (usuario) => {
    try {
      await toggleEstadoUsuario(usuario.id);
      await cargar();
    } catch (err) {
      setError(err.message || TXT.toggleError);
    }
  };

  const confirmarEliminar = async () => {
    setDeleteError('');
    try {
      await deleteUsuario(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch (err) {
      setDeleteError(err.message || TXT.deleteError);
    }
  };

  const dataFiltrada = search
    ? usuarios.filter((u) => `${u.nombre} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
    : usuarios;

  const columns = useMemo(
    () => [
      { key: 'nombre', label: TXT.columns.nombre },
      { key: 'email', label: TXT.columns.email },
      {
        key: 'rol',
        label: TXT.columns.rol,
        render: (row) => TXT.roles.find((r) => r.value === row.rol)?.label ?? row.rol,
      },
      {
        key: 'estado',
        label: TXT.columns.estado,
        render: (row) => <Swich
          value={row.estado}
          onChange={() => handleToggle(row)}
          icons={{ checked: 'check', uncheck: 'x' }}
          {...tableColors}
        />,
      },
      {
        key: 'actions',
        label: COMMON.actions,
        type: 'actions',
        actions: [
          { label: COMMON.edit, onClick: abrirEditar },
          { label: COMMON.delete, onClick: setAEliminar, disabled: (row) => row.email === ADMIN_EMAIL },
        ],
      },
    ],
    [],
  );

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
        showActions
        formId="form-usuario"
        confirmText={editando ? COMMON.save : COMMON.register}
        loading={saving}
        progressMode="form"
        formData={formData}
        requiredFields={editando ? ['nombre', 'email'] : ['nombre', 'email', 'password']}
      >
        <form
          id="form-usuario"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {formError && <FormMessage type="danger">{formError}</FormMessage>}

          <TextField label={TXT.fields.nombre} name="nombre" value={formData.nombre} onChange={handleChange} required />
          <TextField label={TXT.fields.email} name="email" type="email" value={formData.email} onChange={handleChange} required />
          <TextField
            label={TXT.fields.password}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!editando}
            helperText={editando ? TXT.fields.passwordEditHint : undefined}
          />
          <Selector
            label={TXT.fields.rol}
            options={TXT.roles}
            value={formData.rol}
            onChange={(e) => handleChange({ target: { name: 'rol', value: e.target.value } })}
            required
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
