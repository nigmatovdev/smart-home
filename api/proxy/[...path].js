export default async function handler(req, res) {
  // Get the full path from the request
  const fullPath = req.url.replace('/api/proxy/', '');
  
  // Check if this is a video stream request
  const isVideoStream = fullPath.startsWith('stream/');
  
  // Set the target URL based on the request type
  const targetUrl = isVideoStream 
    ? `http://45.9.228.21:8084/${fullPath}`
    : `http://84.54.118.39:8920/${fullPath}`;

  console.log('Proxy Request:', {
    method: req.method,
    url: req.url,
    fullPath,
    targetUrl,
    isVideoStream,
    headers: req.headers
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
    // For HLS streams, we need to handle the response differently
    if (isVideoStream) {
      console.log('Fetching HLS stream from:', targetUrl);
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      console.log('HLS stream response status:', response.status);
      
      if (!response.ok) {
        console.error('HLS stream fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          url: targetUrl
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the content type from the response
      const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
      
      console.log('HLS stream content type:', contentType);
      
      // Set the appropriate headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Transfer-Encoding', 'chunked');
      
      // Stream the response
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
      return;
    }

    // Handle regular API requests
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': req.headers.authorization
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', {
      message: error.message,
      stack: error.stack,
      targetUrl
    });
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      targetUrl,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 