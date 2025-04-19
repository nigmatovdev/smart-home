import React, { useEffect, useRef, useState } from 'react';

const IntercomStream = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  let webrtc = null;
  let mediaStream = null;

  useEffect(() => {
    startPlay();
    return () => {
      if (webrtc) {
        webrtc.close();
      }
    };
  }, []);

  const startPlay = async () => {
    try {
      setIsConnecting(true);
      mediaStream = new MediaStream();
      videoRef.current.srcObject = mediaStream;

      webrtc = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
        sdpSemantics: "unified-plan"
      });

      webrtc.addTransceiver("video", { direction: "recvonly" });
      webrtc.addTransceiver("audio", { direction: "recvonly" });

      webrtc.onnegotiationneeded = handleNegotiationNeeded;
      webrtc.onsignalingstatechange = signalingStateChange;
      webrtc.oniceconnectionstatechange = handleIceConnectionStateChange;

      webrtc.ontrack = (event) => {
        console.log(event.streams.length + ' track delivered');
        mediaStream.addTrack(event.track);
      };
    } catch (err) {
      console.error("Error starting play:", err);
      setError("Failed to initialize video stream");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNegotiationNeeded = async () => {
    try {
      setIsConnecting(true);
      let offer = await webrtc.createOffer();
      await webrtc.setLocalDescription(offer);

      let uuid = "c3b1c7dc-9b6f-409e-bea9-332f8ffb6e3e";
      let channel = "0";
      
      // Use the Vercel proxy for the WebRTC stream
      const url = `/api/proxy/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;
      console.log('Making WebRTC request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          data: btoa(webrtc.localDescription.sdp),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WebRTC request failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Received WebRTC response:', data);

      try {
        webrtc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: atob(data),
        }));
      } catch (sdpError) {
        console.error('Error setting remote description:', sdpError);
        throw new Error('Failed to set remote description');
      }
    } catch (err) {
      console.error("Negotiation error", err);
      setError("Failed to establish video connection");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleIceConnectionStateChange = () => {
    console.log("ICE connection state changed:", webrtc.iceConnectionState);
    if (webrtc.iceConnectionState === 'failed') {
      setError("Connection failed. Please try again.");
    }
  };

  const signalingStateChange = () => {
    console.log("Signaling state changed:", webrtc.signalingState);
  };

  return (
    <div className="w-full">
      {error ? (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-white text-center">
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                startPlay();
              }}
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
            id="videoPlayer"
            autoPlay
            muted
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
  );
};

export default IntercomStream; 