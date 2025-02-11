import { useEffect, useRef } from "react";

function WebcamApp() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    streamWebcam();
  }, []);

  const streamWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (webcamRef.current) {
      webcamRef.current.srcObject = stream;
      await webcamRef.current.play();
    }
  };

  return (
    <div className="rounded-full bg-red-500">
      <video
        ref={webcamRef}
        className="h-screen draggable object-cover rounded-full aspect-video border-2 relative border-white"
      />
    </div>
  );
}

export default WebcamApp;
