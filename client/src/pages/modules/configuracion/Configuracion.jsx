import { useEffect, useState } from 'react';
import { Input, Button } from 'anteriority-ui';
import FormMessage from '../../../components/FormMessage';
import { getConfiguracion, updateConfiguracion } from '../../../services/configuracion';
import { CONFIGURACION as TXT } from '../../../constants/text';

export default function Configuracion() {
  const [diasAlerta, setDiasAlerta] = useState('7');
  const [nombreNucleo, setNombreNucleo] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const cargar = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const config = await getConfiguracion();
      setDiasAlerta(String(config.dias_alerta_vencimiento ?? '7'));
      setNombreNucleo(config.nombre_nucleo ?? '');
    } catch (err) {
      setLoadError(err.message || TXT.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    const dias = parseInt(diasAlerta, 10);
    if (!Number.isInteger(dias) || dias < 1 || dias > 365) {
      setSaveError(TXT.diasAlertaError);
      return;
    }

    setSaving(true);
    try {
      await updateConfiguracion({ dias_alerta_vencimiento: dias, nombre_nucleo: nombreNucleo });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.message || TXT.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#3e2723' }}>{TXT.pageTitle}</h1>
        <p style={{ margin: '4px 0 0', color: '#8d7566' }}>{TXT.pageSubtitle}</p>
      </div>

      {loadError && <FormMessage type="danger">{loadError}</FormMessage>}

      {!loading && !loadError && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          {saveError && <FormMessage type="danger">{saveError}</FormMessage>}
          {saveSuccess && <FormMessage type="success">{TXT.saveSuccess}</FormMessage>}

          <Input
            label={TXT.diasAlertaLabel}
            value={diasAlerta}
            onChange={(e) => {
              setDiasAlerta(e.target.value);
              setSaveSuccess(false);
            }}
            helperText={TXT.diasAlertaHelper}
            required
            numeric
            min={1}
            max={365}
            step={1}
          />

          <Input
            label={TXT.nombreNucleoLabel}
            value={nombreNucleo}
            onChange={(e) => {
              setNombreNucleo(e.target.value);
              setSaveSuccess(false);
            }}
            helperText={TXT.nombreNucleoHelper}
          />

          <Button type="submit" variant="primary" loading={saving}>
            {TXT.saveButton}
          </Button>
        </form>
      )}
    </div>
  );
}
