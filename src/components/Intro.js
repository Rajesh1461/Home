import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const videoStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  minWidth: '100vw',
  minHeight: '100vh',
  width: 'auto',
  height: 'auto',
  zIndex: 9999,
  objectFit: 'cover',
};

const textStyles = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, calc(-50% - 40px))',
  color: 'pink',
  WebkitTextStroke: '2px black',
  textStroke: '2px black',
  fontSize: '100px',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  letterSpacing: '2px',
  zIndex: 10000,
  display: 'none',
  textTransform: 'uppercase',
  textDecoration: 'underline',
  textDecorationColor: 'red',
  textUnderlineOffset: '0.15em',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  textShadow: `0 2px 8px rgba(0,0,0,0.7),
    2px 0 0 #fff,
    -2px 0 0 #fff,
    0 2px 0 #fff,
    0 -2px 0 #fff,
    4px 4px 0 #b30000,
    8px 8px 16px #000,
    1px 1px 0 #800000,
    2px 2px 2px #333`
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.45)',
  color: '#fff',
  zIndex: 20000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  cursor: 'pointer',
  textAlign: 'center',
};

const zoomOutCenter = `@keyframes zoomOutCenter {
  0% {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 40px)) scale(0.1);
  }
  60% {
    opacity: 1;
    transform: translate(-50%, calc(-50% - 40px)) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, calc(-50% - 40px)) scale(1);
  }
}`;

const floatText = `@keyframes floatText {
  0% {
    transform: translate(-50%, calc(-50% - 40px)) scale(1);
  }
  50% {
    transform: translate(-50%, calc(-52% - 40px)) scale(1.04);
  }
  100% {
    transform: translate(-50%, calc(-50% - 40px)) scale(1);
  }
}`;

const colorChange = `@keyframes colorChange {
  0% { color: #ff0000; }
  14% { color: #ff8000; }
  28% { color: #ffff00; }
  42% { color: #00ff00; }
  56% { color: #0080ff; }
  70% { color: #8000ff; }
  84% { color: #ff0080; }
  100% { color: #ff0000; }
}`;

function Intro() {
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Autoplay prevented:', error);
        // Show text immediately if video fails to autoplay
        handleVideoEnd();
      });
    }
  }, []);

  const handleVideoEnd = () => {
    document.body.style.background = 'black';
    if (videoRef.current) videoRef.current.style.display = 'none';
    if (textRef.current) {
      textRef.current.style.display = 'block';
      textRef.current.classList.add('zoom-out-center');
      const handler = () => {
        textRef.current.classList.remove('zoom-out-center');
        textRef.current.classList.add('float-center');
        textRef.current.removeEventListener('animationend', handler);
      };
      textRef.current.addEventListener('animationend', handler);
    }
  };

  const handleTextClick = () => {
    navigate('/home');
  };

  // Allow user to enable audio by clicking anywhere on the video area
  const handleEnableAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(error => {
        console.log('Audio enable failed:', error);
      });
    }
  };

  const handleVideoError = () => {
    console.log('Video failed to load, showing text immediately');
    handleVideoEnd();
  };

  return (
    <>
      <style>{zoomOutCenter + floatText + colorChange}
      {`.zoom-out-center { 
        animation: zoomOutCenter 1.2s cubic-bezier(0.23, 1.01, 0.32, 1) forwards, colorChange 8s ease-in-out infinite !important; 
      }`}
      {`.float-center { 
        animation: floatText 2.5s ease-in-out infinite, colorChange 8s ease-in-out infinite !important; 
      }`}
      {`#bottom-center-text.zoom-out-center,
        #bottom-center-text.float-center,
        .moothedath-text.zoom-out-center,
        .moothedath-text.float-center {
        animation: zoomOutCenter 1.2s cubic-bezier(0.23, 1.01, 0.32, 1) forwards, colorChange 8s ease-in-out infinite !important;
      }`}
      {`#bottom-center-text.float-center,
        .moothedath-text.float-center {
        animation: floatText 2.5s ease-in-out infinite, colorChange 8s ease-in-out infinite !important;
      }`}
      </style>
      <video
        id="bg-video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
        style={videoStyles}
        onClick={handleEnableAudio}
      >
        <source src="/main-wall.mp4" type="video/mp4" />
        <source src="/Wallpaper-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        id="bottom-center-text"
        className="moothedath-text"
        ref={textRef}
        style={textStyles}
        onClick={handleTextClick}
      >
        The Moothedath
      </div>
    </>
  );
}

export default Intro; 