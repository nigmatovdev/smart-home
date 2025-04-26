import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const IntercomStream = ({ uuid, channel, compact = false }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const hlsRef = useRef(null);

  useEffect(() => {
    let hls;
    setIsConnecting(true);
    setError(null);

    const video = videoRef.current;
    const hlsUrl = `/api/proxy/stream/${uuid}/channel/${channel}/hls/live/index.m3u8`;

    console.log('Loading HLS stream:', hlsUrl);

    const loadStream = () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari, some mobile browsers)
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded');
          setIsConnecting(false);
        });
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
          setError('Failed to load video');
        });
      } else if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        
        hls = new Hls({
          debug: true,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hlsRef.current = hls;

        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
          setIsConnecting(false);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', event, data);
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Fatal error, cannot recover');
                setError('Failed to load video');
                setIsConnecting(false);
                break;
            }
          }
        });
      } else {
        setError('HLS is not supported in this browser');
        setIsConnecting(false);
      }
    };

    loadStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.src = '';
      }
    };
  }, [uuid, channel]);

  if (compact) {
    return (
      <div className="relative w-full h-full">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <p className="text-lg font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="mt-2">Connecting...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          {error ? (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-white text-center">
                <p className="text-lg font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                controls
                playsInline
                className="w-full object-cover rounded-lg"
              />
              {isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2">Connecting...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntercomStream; 