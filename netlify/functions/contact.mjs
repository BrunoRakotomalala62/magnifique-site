export default async (request, context) => {
  // GET = documentation de l’API
  if (request.method === 'GET') {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Contact — Lumière</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0b0c10;
      color: #f5f5f7;
      max-width: 720px;
      margin: 3rem auto;
      padding: 1rem;
      line-height: 1.6;
    }
    h1 { color: #8b5cf6; }
    code {
      background: rgba(255,255,255,0.08);
      padding: 0.2rem 0.4rem;
      border-radius: 0.3rem;
      font-size: 0.95rem;
    }
    pre {
      background: rgba(255,255,255,0.06);
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
    }
    .endpoint {
      color: #06b6d4;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <h1>✦ API Contact — Lumière</h1>
  <p>Cet endpoint reçoit les messages du formulaire de contact.</p>

  <h2>Endpoint</h2>
  <p class="endpoint">POST /.netlify/functions/contact</p>

  <h2>Exemple de requête</h2>
  <pre>curl -X POST ${request.url} \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Jean","email":"jean@example.com","message":"Bonjour"}'</pre>

  <h2>Corps attendu (JSON)</h2>
  <ul>
    <li><code>name</code> — votre nom</li>
    <li><code>email</code> — une adresse e-mail valide</li>
    <li><code>message</code> — le message</li>
  </ul>

  <h2>Réponse en cas de succès</h2>
  <pre>{"success":true,"message":"Message reçu avec succès !"}</pre>

  <p><a href="/" style="color:#8b5cf6">← Retour au site</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Tout sauf POST = méthode non autorisée
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Méthode non autorisée.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: 'Tous les champs sont requis.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Adresse e-mail invalide.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log the submission in Netlify function logs
    console.log('Nouveau message de contact:', { name, email, message });

    // Optional: forward to a webhook if configured (e.g. Slack/Discord/Make)
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, date: new Date().toISOString() }),
      }).catch((err) => console.error('Webhook error:', err));
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message reçu avec succès !' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur back-end:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Une erreur est survenue.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
