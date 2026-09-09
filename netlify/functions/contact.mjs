export default async (request, context) => {
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
