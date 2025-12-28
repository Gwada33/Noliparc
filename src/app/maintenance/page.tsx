import { get_config } from '@/lib/config';

export default async function MaintenancePage() {
  const config = await get_config();
  const nextOpening = typeof config?.nextOpening === 'string' ? config.nextOpening : '';
  const message = typeof config?.globalMessage === 'string' ? config.globalMessage : '';

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#fff',
        color: '#111',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Site en maintenance</h1>
        <p style={{ marginTop: 12, marginBottom: 0, fontSize: 18, lineHeight: 1.5, color: '#333' }}>
          Nous effectuons actuellement des mises à jour pour améliorer votre expérience.
        </p>

        {message ? (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              background: '#fff3e0',
              color: '#111',
              fontWeight: 700,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </div>
        ) : null}

        {nextOpening ? (
          <p style={{ marginTop: 18, marginBottom: 0, fontSize: 16, color: '#555' }}>
            Réouverture prévue : <strong>{nextOpening}</strong>
          </p>
        ) : null}

        <p style={{ marginTop: 18, marginBottom: 0, fontSize: 14, color: '#666' }}>
          Contact : <a href="mailto:contact@noliparc.fr">contact@noliparc.fr</a>
        </p>
      </div>
    </main>
  );
}
