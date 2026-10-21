import { useState } from 'react';
import { Container, Button, Badge, BlueLink, MarkdownContent } from 'anteriority-ui';
import { RefreshCw, Plug, Users, Link2, UserX } from 'lucide-react';
import { syncContextHub } from '../../../services/configuracion';
import { CONFIGURACION as TXT } from '../../../constants/text';
import FormMessage from '../../../components/FormMessage';

export default function Settings() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    setResult(null);
    try {
      const data = await syncContextHub();
      setResult(data);
    } catch (err) {
      setError(err.message || TXT.syncError);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#0b3558' }}>{TXT.pageTitle}</h1>
        <p style={{ margin: '4px 0 0', color: '#476788' }}>{TXT.pageSubtitle}</p>
      </div>

      <Container wattermark={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Plug size={22} color="#0b3558" />
            <h2 style={{ margin: 0, fontSize: 20, color: '#0b3558' }}>{TXT.contextHubTitle}</h2>
          </div>
          <BlueLink label={TXT.contextHubLinkLabel} url={TXT.contextHubLinkUrl} />
        </div>

        <div style={{ maxWidth: 720, marginBottom: 12 }}>
          <MarkdownContent>{TXT.contextHubMarkdown}</MarkdownContent>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button variant="primary" icon={RefreshCw} onClick={handleSync} loading={syncing}>
            {syncing ? TXT.syncing : TXT.syncButton}
          </Button>

          {error && <FormMessage type="danger">{error}</FormMessage>}

          {result && !error && (
            <>
              <FormMessage type="success">{TXT.syncSuccess(result.actualizados)}</FormMessage>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Badge icon={Users} label={TXT.syncSummary.totalContextHub} value={result.totalContextHub} />
                <Badge icon={Users} label={TXT.syncSummary.totalLocal} value={result.totalLocal} />
                <Badge icon={Link2} label={TXT.syncSummary.actualizados} value={result.actualizados} />
                <Badge icon={UserX} label={TXT.syncSummary.sinCoincidencia} value={result.sinCoincidencia?.length ?? 0} />
              </div>

              {result.sinCoincidencia?.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 20, color: '#64748b', fontSize: 13 }}>
                  {result.sinCoincidencia.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
