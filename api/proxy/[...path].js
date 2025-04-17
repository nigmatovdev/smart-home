export default async function handler(req, res) {
  // Get the full path from the request
  const fullPath = req.url.replace('/api/proxy/', '');
  const targetUrl = `http://84.54.118.39:8920/${fullPath}`;

  console.log('Request details:', {
    method: req.method,
    url: req.url,
    targetUrl,
    body: req.body
  });

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the raw body from the request
    const requestBody = req.body;

    console.log('Making request to:', {
      targetUrl,
      method: req.method,
      body: requestBody
    });

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Success response:', data);
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error details:', {
      message: error.message,
      stack: error.stack,
      targetUrl
    });
    
    // If it's a 400 error, forward the error message directly
    if (error.message.includes('status: 400')) {
      const errorBody = JSON.parse(error.message.split('body: ')[1]);
      res.status(400).json(errorBody);
      return;
    }
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      targetUrl,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 