// netlify/functions/chat.js
// ─────────────────────────────────────────────────────────────
// Serverless proxy — keeps OPENROUTER_API_KEY secret on server.
// Frontend calls /.netlify/functions/chat instead of OpenRouter directly.
// ─────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // CORS headers — allow your Netlify domain
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // ← from Netlify env
        'HTTP-Referer': 'https://sakshi-selmokar.netlify.app',
        'X-Title': 'Sakshi Selmokar Portfolio',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        max_tokens: 1000,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
