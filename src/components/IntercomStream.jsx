import React, { useEffect, useRef } from 'react';

const IntercomStream = () => {
  const videoRef = useRef(null);
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

    webrtc.ontrack = (event) => {
      console.log(event.streams.length + ' track delivered');
      mediaStream.addTrack(event.track);
    };
  };

  const handleNegotiationNeeded = async () => {
    try {
      let offer = await webrtc.createOffer();
      await webrtc.setLocalDescription(offer);

      let uuid = "c3b1c7dc-9b6f-409e-bea9-332f8ffb6e3e";
      let channel = "0";
      let url = `http://45.9.228.21:8084/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          data: btoa(webrtc.localDescription.sdp),
        }),
      });

      const data = await response.text();

      webrtc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(data),
      }));
    } catch (err) {
      console.error("Negotiation error", err);
    }
  };

  const signalingStateChange = () => {
    console.log("Signaling state changed:", webrtc.signalingState);
  };

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        id="videoPlayer"
        autoPlay
        muted
        playsInline
        className="w-full object-cover rounded-lg"
      />
    </div>
  );
};

export default IntercomStream; 