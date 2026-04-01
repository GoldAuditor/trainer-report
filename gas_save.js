exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const GAS_URL = process.env.GAS_URL;
  if (!GAS_URL) {
    return { statusCode: 500, headers, body: JSON.stringify({ status: 'error', message: 'GAS_URL not configured' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    const text = await res.text();
    return { statusCode: 200, headers, body: text };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};
