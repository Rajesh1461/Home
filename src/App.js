// Trigger redeploy: 
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Events from './components/Events';
import About from './components/About';
import Blog from './components/Blog';
import Contribute from './components/Contribute';
import Chat from './components/Chat';
import UploadPortal from './components/UploadPortal';
import Contact from './components/Contact';
import LogoTest from './components/LogoTest';
import Intro from './components/Intro';
import RainbowTest from './components/RainbowTest';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';

const initialMedia = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    title: 'Family Gathering 2024',
    year: 2024,
    event: 'Family Reunion',
    person: 'All Family',
    location: 'Thinnai',
    caption: 'Annual family reunion in the traditional thinnai'
  },
  {
    id: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    title: 'Temple Festival',
    year: 2023,
    event: 'Temple Festival',
    person: 'Community',
    location: 'Temple',
    caption: 'Traditional temple festival celebration'
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    title: 'Wedding Ceremony',
    year: 2023,
    event: 'Wedding',
    person: 'Newlyweds',
    location: 'Veranda',
    caption: 'Beautiful wedding ceremony in the ancestral house'
  },
  {
    id: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    title: 'Pongal Celebration',
    year: 2024,
    event: 'Pongal',
    person: 'Family',
    location: 'Kitchen',
    caption: 'Traditional Pongal cooking in the ancestral kitchen'
  },
  {
    id: 5,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    title: 'Onam Festivities',
    year: 2024,
    event: 'Onam',
    person: 'Family',
    location: 'Courtyard',
    caption: 'Onam flower carpet and celebrations in the courtyard'
  },
  {
    id: 6,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
    title: 'Other Family Moments',
    year: 2023,
    event: 'Other',
    person: 'Family',
    location: 'Garden',
    caption: 'Candid family moments in the garden'
  },
  // ... other initial media ...
];

function AppContent({ media, setMedia }) {
  const location = useLocation();
  const isLogoTestPage = location.pathname === '/logo-test';
  const isIntroPage = location.pathname === '/' || location.pathname === '/Intro' || location.pathname === '/Home/Intro';
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  // Persistent login state using Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser({
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL || '',
          displayName: user.displayName || '',
          phoneNumber: user.phoneNumber || '',
          providerId: user.providerId || '',
        });
      } else {
        setIsLoggedIn(false);
        setCurrentUser({});
      }
    });
    return () => unsubscribe();
  }, []);

  const handleMuteToggle = () => {
    setMuted((prev) => {
      const newMuted = !prev;
      if (videoRef.current) videoRef.current.muted = newMuted;
      return newMuted;
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: 'transparent', minHeight: '100vh', margin: 0 }}>
      {/* Video and mute button (background) */}
      {(!isLogoTestPage && !isIntroPage) && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={muted}
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            minWidth: '100vw',
            minHeight: '100vh',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src="/Wallpaper-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Header: nav and passport photo box always on top */}
      <div style={{ position: 'relative', zIndex: 2000 }}>
        {(!isLogoTestPage && !isIntroPage) && (
          <>
            {/* Mute/Unmute Button - bottom right corner */}
            <button
              onClick={handleMuteToggle}
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 10001,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
              }}
              aria-label={muted ? 'Unmute background video' : 'Mute background video'}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <span role="img" aria-label="muted">🔇</span>
              ) : (
                <span role="img" aria-label="unmuted">🔊</span>
              )}
            </button>
            <nav style={{
              background: 'rgba(128,128,128,0.5)',
              padding: '1rem',
              display: 'flex',
              gap: '1.2rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              overflowX: 'visible',
              whiteSpace: 'normal',
              minWidth: 0,
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginLeft: '32px' }}>
                <img 
                  src={process.env.PUBLIC_URL + '/Logo.png'} 
                  alt="Logo" 
                  className="logo-animation"
                  style={{ 
                    height: 96, 
                    borderRadius: 18,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1) rotate(5deg)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                    e.target.style.animationPlayState = 'paused';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) rotate(0deg)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.animationPlayState = 'running';
                  }}
                />
                <span style={{ 
                  fontWeight: 'bold', 
                  fontSize: '2.1rem', 
                  lineHeight: 1.1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start', 
                  whiteSpace: 'normal',
                  animation: 'rainbow 6s linear infinite',
                  textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
                }}>
                  The Moothedath<br />Ancestral House
                </span>
                <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Home</Link>
                <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>About</Link>
                <Link to="/gallery" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Gallery</Link>
                <Link to="/events" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Events</Link>
                <Link to="/upload" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Login / Register</Link>
                <Link to="/upload-portal" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Upload Portal</Link>
                <Link to="/chat" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Chat</Link>
                <Link to="/blog" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Blog</Link>
                <Link to="/contribute" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Contribute</Link>
                <Link to="/contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginLeft: '8px', marginRight: 0 }}>Contact Us</Link>
              </div>
            </nav>
            <PassportPhotoBox
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </>
        )}
      </div>
      <style>{`
        nav a {
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          border-radius: 8px;
          padding: 0.3em 1.1em;
          display: inline-block;
        }
        nav a:hover {
          background: #28a745 !important;
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(40,167,69,0.15);
          text-decoration: none !important;
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        .logo-animation {
          animation: logoFloat 3s ease-in-out infinite;
        }
        
        @keyframes rainbow {
          0% { color: #ff0000; }
          14% { color: #ff8000; }
          28% { color: #ffff00; }
          42% { color: #00ff00; }
          56% { color: #0080ff; }
          70% { color: #8000ff; }
          84% { color: #ff0080; }
          100% { color: #ff0000; }
        }
      `}</style>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/Intro" element={<Intro />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery media={media} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/upload" element={<Login media={media} setMedia={setMedia} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />
        <Route path="/upload-portal" element={<UploadPortal media={media} setMedia={setMedia} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contribute" element={<Contribute isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/logo-test" element={<LogoTest />} />
        <Route path="/rainbow-test" element={<RainbowTest />} />
      </Routes>
    </div>
  );
}

function App() {
  const [media, setMedia] = useState(initialMedia);
  return (
    <Router>
      <AppContent media={media} setMedia={setMedia} />
    </Router>
  );
}

export default App;

// PassportPhotoBox component
function PassportPhotoBox({ isLoggedIn, currentUser, setCurrentUser }) {
  const fileInputRef = React.useRef();
  const [uploading, setUploading] = React.useState(false);

  const handleBoxClick = () => {
    if (isLoggedIn && (!currentUser || !currentUser.photoURL)) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be less than 10MB');
      return;
    }
    setUploading(true);
    try {
      // Upload to Firebase Storage
      const { storage, auth } = await import('./firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const storageRef = ref(storage, `profile_photos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setCurrentUser(prev => ({ ...prev, photoURL: downloadURL }));
      alert('Profile photo updated!');
    } catch (err) {
      alert('Failed to upload profile photo: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div
      style={{
        width: 80,
        height: 100,
        border: '2px solid #888',
        borderRadius: 6,
        background: '#f8f8f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        color: '#888',
        margin: '12px 0 0 32px',
        position: 'relative',
        zIndex: 1000,
        overflow: 'hidden',
        cursor: isLoggedIn && (!currentUser || !currentUser.photoURL) ? 'pointer' : 'default',
        boxShadow: isLoggedIn && (!currentUser || !currentUser.photoURL) ? '0 0 0 2px #007bff' : undefined
      }}
      title={isLoggedIn && (!currentUser || !currentUser.photoURL) ? 'Click to upload profile photo' : ''}
      onClick={handleBoxClick}
    >
      {isLoggedIn && currentUser && currentUser.photoURL ? (
        <img
          src={currentUser.photoURL}
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : uploading ? (
        'Uploading...'
      ) : isLoggedIn ? (
        'Click to upload Photo'
      ) : (
        'Passport Photo'
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
