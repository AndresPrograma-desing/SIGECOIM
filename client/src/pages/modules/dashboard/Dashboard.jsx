import { useEffect, useMemo, useState } from 'react';
import { TableB, Badge } from 'anteriority-ui';
import { Phone, PackageCheck } from 'lucide-react';
import { getAlertasPorVencer } from '../../../services/comodatos';
import { getStockPorTipo } from '../../../services/instrumentos';
import { getConfiguracion } from '../../../services/configuracion';
import { COMMON, DASHBOARD as TXT } from '../../../constants/text';
import { tableColors } from '../../../theme/tokens';

export default function Dashboard() {
  const [alertas, setAlertas] = useState([]);
  const [stock, setStock] = useState([]);
  const [diasVentana, setDiasVentana] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = await getConfiguracion();
      const dias = parseInt(config.dias_alerta_vencimiento, 10) || 7;
      setDiasVentana(dias);

      const [alertasData, stockData] = await Promise.all([
        getAlertasPorVencer(dias),
        getStockPorTipo(),
      ]);
      setAlertas(alertasData);
      setStock(stockData);
    } catch (err) {
      setError(err.message || TXT.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);
  const vencidos = alertas.filter((a) => a.fecha_devolucion_prevista < hoy);
  const porVencer = alertas.filter((a) => a.fecha_devolucion_prevista >= hoy);

  const columns = useMemo(
    () => [
      { key: 'folio_contrato', label: TXT.alertasColumns.folio },
      {
        key: 'estudiante',
        label: TXT.alertasColumns.estudiante,
        render: (row) => `${row.estudiante?.nombre ?? ''} ${row.estudiante?.apellido ?? ''}`.trim() || COMMON.notAvailable,
      },
      { key: 'instrumento', label: TXT.alertasColumns.instrumento, render: (row) => row.instrumento?.nombre || COMMON.notAvailable },
      {
        key: 'representante',
        label: TXT.alertasColumns.representante,
        render: (row) => {
          const rep = row.estudiante?.representante;
          return rep ? `${rep.nombre} ${rep.apellido}` : COMMON.notAvailable;
        },
      },
      {
        key: 'telefono',
        label: TXT.alertasColumns.telefono,
        render: (row) => row.estudiante?.representante?.telefono || COMMON.notAvailable,
      },
      { key: 'fecha_devolucion_prevista', label: TXT.alertasColumns.fechaPrevista },
      {
        key: 'estado_vencimiento',
        label: '',
        type: 'badge',
        badgeType: (row) => (row.fecha_devolucion_prevista < hoy ? 'danger' : 'warning'),
        render: (row) => (row.fecha_devolucion_prevista < hoy ? TXT.alertasVencidos : TXT.alertasPorVencer),
      },
    ],
    [hoy],
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#0b3558' }}>{TXT.pageTitle}</h1>
        <p style={{ margin: '4px 0 0', color: '#476788' }}>{TXT.pageSubtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <Badge icon={Phone} label={TXT.alertasVencidos} value={vencidos.length} />
        <Badge icon={Phone} label={TXT.alertasPorVencer} value={porVencer.length} />
      </div>

      <h2 style={{ fontSize: 18, color: '#0b3558', marginBottom: 4 }}>{TXT.alertasTitle}</h2>
      <p style={{ margin: '0 0 12px', color: '#476788', fontSize: 13 }}>{TXT.alertasVentana(diasVentana)}</p>
      <TableB
        columns={columns}
        data={alertas}
        rowKey="id"
        loading={loading}
        error={error}
        onRetry={cargar}
        emptyMessage={TXT.alertasEmpty}
        scrollFooter
        {...tableColors}
      />

      <h2 style={{ fontSize: 18, color: '#0b3558', margin: '28px 0 12px' }}>{TXT.stockTitle}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stock.map((row, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PackageCheck size={18} color="#0b3558" />
              <span style={{ fontSize: 14, color: '#0b3558', fontWeight: 600 }}>{row.tipo || '—'}</span>
            </div>
            <Badge label={row.estado_disponibilidad} value={row.total} />
          </div>
        ))}
      </div>
    </div>
  );
}
