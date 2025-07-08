import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Upload() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'image',
    file: null,
    event: '',
    location: '',
    people: [],
    caption: '',
    tags: []
  });
  const [activeTab, setActiveTab] = useState('login');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    profilePhoto: null,
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [mediaList, setMediaList] = useState([]);

  // Persist login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ email: user.email, uid: user.uid });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch uploaded media from Firestore
  useEffect(() => {
    if (isLoggedIn) {
      const fetchMedia = async () => {
        const q = query(collection(db, "media"), orderBy("uploadDate", "desc"));
        const querySnapshot = await getDocs(q);
        setMediaList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchMedia();
    }
  }, [isLoggedIn]);

  // Registration handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    if (!registerForm.fullName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setRegisterError('Please fill in all required fields.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (!registerForm.agree) {
      setRegisterError('You must agree to the Terms & Conditions.');
      return;
    }
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      const user = userCredential.user;
      // Save extra info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: registerForm.fullName,
        email: registerForm.email,
        mobile: registerForm.mobile || "",
        profilePhoto: "", // You can add upload logic later
        role: "Member"
      });
      setRegisterSuccess('Registration successful! Please log in.');
      setRegisterForm({
        fullName: '',
        email: '',
        mobile: '',
        profilePhoto: null,
        password: '',
        confirmPassword: '',
        agree: false
      });
      setTimeout(() => {
        setActiveTab('login');
        setRegisterSuccess('');
      }, 2000);
    } catch (error) {
      setRegisterError(error.message);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const user = userCredential.user;
      setCurrentUser({ email: user.email, uid: user.uid });
      setIsLoggedIn(true);
      alert(`Welcome back, ${user.email}!`);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
  };

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  // Upload handler using Firebase Storage and Firestore
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }
    try {
      // 1. Upload file to Firebase Storage
      const fileRef = ref(storage, `uploads/${currentUser.uid}/${Date.now()}_${uploadForm.file.name}`);
      await uploadBytes(fileRef, uploadForm.file);
      const fileUrl = await getDownloadURL(fileRef);

      // 2. Save metadata to Firestore
      await addDoc(collection(db, "media"), {
        title: uploadForm.title,
        type: uploadForm.type,
        url: fileUrl,
        uploadedBy: currentUser.email,
        uploaderId: currentUser.uid,
        uploadDate: serverTimestamp(),
        tags: uploadForm.tags,
        event: uploadForm.event,
        location: uploadForm.location,
        caption: uploadForm.caption
      });

      // 3. Reset form and show success
      setUploadForm({
        title: '',
        type: 'image',
        file: null,
        event: '',
        location: '',
        people: [],
        caption: '',
        tags: []
      });
      alert('Media uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const addTag = (tag) => {
    if (!uploadForm.tags.includes(tag)) {
      setUploadForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setUploadForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEvent = filterEvent === 'All' || item.event === filterEvent;
    const matchesLocation = filterLocation === 'All' || item.location === filterLocation;
    return matchesSearch && matchesEvent && matchesLocation;
  });

  if (!isLoggedIn) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '40px 8px 40px 8px',
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}>
          <div style={{
            background: 'transparent',
            padding: '2rem',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 102,
            width: '100%',
            maxWidth: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h1 style={{ position: 'relative', zIndex: 102, color: '#222', fontSize: '2rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>Login / Registration</h1>
            <p style={{ position: 'relative', zIndex: 102, color: '#000', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
              Secure family login to upload and manage photos and videos from our ancestral house.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 101 }}>
              <button
                onClick={() => setActiveTab('login')}
                className="upload-auth-btn"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: 8,
                  background: activeTab === 'login' ? '#007bff' : 'transparent',
                  color: activeTab === 'login' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'login' ? 'bold' : 'normal',
                  position: 'relative',
                  zIndex: 102
                }}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="upload-auth-btn"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: 8,
                  background: activeTab === 'register' ? '#007bff' : 'transparent',
                  color: activeTab === 'register' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'register' ? 'bold' : 'normal',
                  position: 'relative',
                  zIndex: 102
                }}
              >
                Register
              </button>
            </div>
            {activeTab === 'login' && (
              <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
                <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>👨‍👩‍👧‍👦 Family Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102 }}>
                  <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="login-email" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Family Email *</label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your family email"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="login-password" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Password *</label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <button type="submit" style={{
                    position: 'relative', zIndex: 105,
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    Login to Upload Portal
                  </button>
                </form>
              </div>
            )}
            {activeTab === 'register' && (
              <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
                <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>📝 Register</h2>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102 }}>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-fullName" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Full Name *</label>
                    <input
                      id="register-fullName"
                      name="fullName"
                      type="text"
                      required
                      value={registerForm.fullName}
                      onChange={e => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-email" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Email *</label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-mobile" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Mobile *</label>
                    <input
                      id="register-mobile"
                      name="mobile"
                      type="text"
                      required
                      value={registerForm.mobile}
                      onChange={e => setRegisterForm(prev => ({ ...prev, mobile: e.target.value }))}
                      placeholder="Enter your mobile number"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-profilePhoto" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Profile Photo</label>
                    <input
                      id="register-profilePhoto"
                      name="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setRegisterForm(prev => ({ ...prev, profilePhoto: file }));
                        }
                      }}
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-password" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Password *</label>
                    <input
                      id="register-password"
                      name="password"
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-confirmPassword" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Confirm Password *</label>
                    <input
                      id="register-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={registerForm.confirmPassword}
                      onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Enter your password again"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px', width: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 103 }}>
                    <label htmlFor="register-agree" style={{ position: 'relative', zIndex: 104, marginRight: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Agree to Terms & Conditions *</label>
                    <input
                      id="register-agree"
                      name="agree"
                      type="checkbox"
                      required
                      checked={registerForm.agree}
                      onChange={e => setRegisterForm(prev => ({ ...prev, agree: e.target.checked }))}
                      style={{ position: 'relative', zIndex: 105 }}
                    />
                  </div>
                  <button type="submit" style={{
                    position: 'relative', zIndex: 105,
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%',
                    boxSizing: 'border-box',
                    marginBottom: '10px'
                  }}>
                    Register
                  </button>
                  {registerError && <div style={{ color: 'red', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{registerError}</div>}
                  {registerSuccess && <div style={{ color: 'green', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{registerSuccess}</div>}
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Copyright Footer - bottom centered, fixed, Home page style */}
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 'calc(2rem - 5px)',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          padding: '1rem 2rem',
          display: 'inline-block',
          border: '1px solid rgba(40,167,69,0.15)',
          pointerEvents: 'auto'
        }}>
          <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
            © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', position: 'relative', zIndex: 100, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 101 }}>
          <div>
            <h1 style={{ position: 'relative', zIndex: 102, color: '#222', fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'left', width: '100%' }}>🖼️ Photo & Video Upload Portal</h1>
            <p style={{ position: 'relative', zIndex: 102, color: '#555', textAlign: 'left', width: '100%' }}>
              Welcome, {currentUser.email}! Upload and manage family memories.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 6,
              cursor: 'pointer',
              position: 'relative',
              zIndex: 102
            }}
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 101, width: '50%', margin: '0 auto' }}>
          <div>
            <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>📤 Upload New Media</h2>
            <form onSubmit={handleUpload} style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 102
            }}>
              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-title" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Title *</label>
                <input
                  id="upload-title"
                  name="title"
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, textAlign: 'left' }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-type" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Media Type *</label>
                <select
                  id="upload-type"
                  name="type"
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, textAlign: 'left' }}
                >
                  <option value="image">Image (JPEG, PNG, WebP)</option>
                  <option value="video">Video (MP4, MOV)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-file" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>File *</label>
                <input
                  id="upload-file"
                  name="file"
                  type="file"
                  required
                  accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, textAlign: 'left' }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-event" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Event</label>
                <select
                  id="upload-event"
                  name="event"
                  value={uploadForm.event}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, event: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, textAlign: 'left' }}
                >
                  <option value="">Select an event</option>
                  {['Family Reunion', 'Temple Festival', 'Wedding', 'Pongal', 'Onam', 'Daily Life', 'Other'].map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-location" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Location</label>
                <select
                  id="upload-location"
                  name="location"
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, textAlign: 'left' }}
                >
                  <option value="">Select a location</option>
                  {['Thinnai', 'Veranda', 'Kitchen', 'Prayer Room', 'Temple', 'Granary', 'Courtyard', 'Other'].map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-people" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>People in Media</label>
                <div style={{ position: 'relative', zIndex: 105, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {['All Family', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Children', 'Community'].map(person => (
                    <label key={person} style={{ position: 'relative', zIndex: 106, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={uploadForm.people.includes(person)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUploadForm(prev => ({ ...prev, people: [...prev.people, person] }));
                          } else {
                            setUploadForm(prev => ({ ...prev, people: prev.people.filter(p => p !== person) }));
                          }
                        }}
                        style={{ position: 'relative', zIndex: 107 }}
                      />
                      <span style={{ position: 'relative', zIndex: 107 }}>{person}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-caption" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Caption</label>
                <textarea
                  id="upload-caption"
                  name="caption"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Describe the photo or video..."
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80, textAlign: 'left' }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label htmlFor="upload-tags" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Tags</label>
                <div style={{ position: 'relative', zIndex: 105, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {uploadForm.tags.map(tag => (
                    <span key={tag} style={{ 
                      position: 'relative', zIndex: 106,
                      background: '#007bff', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 4,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{ position: 'relative', zIndex: 107, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ position: 'relative', zIndex: 105, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['family', 'celebration', 'traditional', 'heritage', 'temple', 'cooking', 'festival'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      style={{
                        position: 'relative', zIndex: 106,
                        background: 'transparent',
                        border: '1px solid #ddd',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" style={{
                position: 'relative', zIndex: 105,
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                Upload Your Memories
              </button>
              {registerError && <div style={{ color: 'red', marginTop: '1rem' }}>{registerError}</div>}
              {registerSuccess && <div style={{ color: 'green', marginTop: '1rem' }}>{registerSuccess}</div>}
            </form>
          </div>
        </div>
        {/* Footer */}
      </div>
      {/* Copyright Footer - bottom centered at end of content */}
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '1rem 2rem',
        display: 'block',
        border: '1px solid rgba(40,167,69,0.15)',
        pointerEvents: 'auto',
        margin: '2rem auto 0',
        width: 'fit-content',
        maxWidth: '90vw',
        textAlign: 'center'
      }}>
        <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
          © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
        </footer>
      </div>
    </div>
  );
}

export default Upload; 