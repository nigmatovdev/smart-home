export default async function handler(req, res) {
  // Get the full path from the request
  const fullPath = req.url.replace('/api/proxy/', '');
  
  // Check if this is a video stream request
  const isVideoStream = fullPath.startsWith('stream/');
  
  // Set the target URL based on the request type
  const targetUrl = isVideoStream 
    ? `http://45.9.228.21:8084/${fullPath}`
    : `http://84.54.118.39:8920/${fullPath}`;

  console.log('Request details:', {
    method: req.method,
    url: req.url,
    fullPath,
    targetUrl,
    isVideoStream,
    headers: req.headers,
    body: req.body
  });

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': isVideoStream ? 'application/vnd.apple.mpegurl' : 'application/json',
        'Accept': isVideoStream ? 'application/vnd.apple.mpegurl' : 'application/json',
        'Authorization': req.headers.authorization
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
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

    // For video stream responses, return the raw text
    if (isVideoStream) {
      const text = await response.text();
      console.log('Video stream response:', text);
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.status(response.status).send(text);
    } else {
      const data = await response.json();
      console.log('Success response:', data);
      res.status(response.status).json(data);
    }
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