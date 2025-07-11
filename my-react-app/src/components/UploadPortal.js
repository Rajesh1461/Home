import React, { useState } from 'react';

// Copy the same sample data and logic as Upload.js
const familyMembers = [
  { id: 1, name: 'Father', email: 'family.moothedathhouse@gmail.com', role: 'Admin' },
  { id: 2, name: 'Mother', email: 'family.moothedathhouse@gmail.com', role: 'Admin' },
  { id: 3, name: 'Grandfather', email: 'family.moothedathhouse@gmail.com', role: 'Member' },
  { id: 4, name: 'Grandmother', email: 'family.moothedathhouse@gmail.com', role: 'Member' },
  { id: 5, name: 'Uncle', email: 'family.moothedathhouse@gmail.com', role: 'Member' },
  { id: 6, name: 'Aunt', email: 'family.moothedathhouse@gmail.com', role: 'Member' }
];

const uploadedMedia = [
  {
    id: 1,
    title: 'Family Reunion 2024',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    uploadedBy: 'Father',
    uploadDate: '2024-12-20',
    tags: ['family reunion', '2024', 'all family', 'thinnai'],
    event: 'Family Reunion',
    location: 'Thinnai',
    caption: 'Annual family reunion in the traditional thinnai'
  },
  {
    id: 2,
    title: 'Temple Festival Video',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    uploadedBy: 'Mother',
    uploadDate: '2024-12-18',
    tags: ['temple festival', '2024', 'community', 'temple'],
    event: 'Temple Festival',
    location: 'Temple',
    caption: 'Traditional temple festival celebration'
  }
];

const events = ['Family Reunion', 'Temple Festival', 'Wedding', 'Pongal', 'Onam', 'Daily Life', 'Other'];
const locations = ['Thinnai', 'Veranda', 'Kitchen', 'Prayer Room', 'Temple', 'Granary', 'Courtyard', 'Other'];
const people = ['All Family', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Children', 'Community'];

function UploadPortal({ media, setMedia }) {
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

  const handleLogin = (e) => {
    e.preventDefault();
    const user = familyMembers.find(member => member.email === loginForm.email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      alert(`Welcome back, ${user.name}!`);
    } else {
      alert('Invalid email. Please use a registered family email.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert('Please select a file.');
      return;
    }
    if (uploadForm.type === 'image' && uploadForm.file.size > 10 * 1024 * 1024) {
      alert('Photo must be less than 10MB');
      return;
    }
    if (uploadForm.type === 'video' && uploadForm.file.size > 100 * 1024 * 1024) {
      alert('Video must be less than 100MB');
      return;
    }
    const newMedia = {
      id: Date.now(),
      title: uploadForm.file.name,
      type: uploadForm.type,
      url: URL.createObjectURL(uploadForm.file),
      uploadedBy: currentUser ? currentUser.name : 'You',
      uploadDate: new Date().toISOString().split('T')[0],
      event: uploadForm.event,
      location: uploadForm.location,
      caption: uploadForm.caption
    };
    setMedia([newMedia, ...media]);
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
  };

  const addTag = (tag) => {
    if (!uploadForm.tags.includes(tag)) {
      setUploadForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setUploadForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEvent = filterEvent === 'All' || item.event === filterEvent;
    const matchesLocation = filterLocation === 'All' || item.location === filterLocation;
    return matchesSearch && matchesEvent && matchesLocation;
  });

  if (!isLoggedIn) {
    return (
<<<<<<< HEAD
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
        <h1 style={{ position: 'relative', zIndex: 2, color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>Photo & Video Upload Portal</h1>
        <p style={{ position: 'relative', zIndex: 10, color: '#222', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.15rem', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
          Secure family login to upload and manage photos and videos from our ancestral house.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
              fontWeight: activeTab === 'login' ? 'bold' : 'normal'
            }}
          >
            Login
          </button>

        </div>
        {activeTab === 'login' && (
          <div style={{ background: 'transparent', padding: '1rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ position: 'relative', zIndex: 2, color: '#333', fontSize: '1.5rem', marginBottom: '10px' }}>👨‍👩‍👧‍👦 Family Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Family Email *</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your family email"
                  style={{ position: 'relative', zIndex: 2, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password *</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  style={{ position: 'relative', zIndex: 2, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" style={{
                position: 'relative', zIndex: 2,
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                width: '32rem',
                boxSizing: 'border-box',
                marginBottom: '10px'
              }}>
                Login to Upload Portal
              </button>
            </form>
          </div>
        )}
=======
      <div style={{ position: 'relative' }}>
        <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
          <h1 style={{ position: 'relative', zIndex: 2, color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>Photo & Video Upload Portal</h1>
          <p style={{ position: 'relative', zIndex: 10, color: '#222', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.15rem', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
            Secure family login to upload and manage photos and videos from our ancestral house.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
                fontWeight: activeTab === 'login' ? 'bold' : 'normal'
              }}
            >
              Login
            </button>

          </div>
          {activeTab === 'login' && (
            <div style={{ background: 'transparent', padding: '1rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h2 style={{ position: 'relative', zIndex: 2, color: '#333', fontSize: '1.5rem', marginBottom: '10px' }}>👨‍👩‍👧‍👦 Family Login</h2>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Family Email *</label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your family email"
                    style={{ position: 'relative', zIndex: 2, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password *</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    style={{ position: 'relative', zIndex: 2, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{
                  position: 'relative', zIndex: 2,
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '32rem',
                  boxSizing: 'border-box',
                  marginBottom: '10px'
                }}>
                  Login to Upload Portal
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Copyright Footer - Same as Home page */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem 0', 
          marginTop: 'calc(2rem - 5px)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.5)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <p style={{ 
              color: '#000', 
              fontSize: '0.9rem', 
              margin: 0,
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(255,255,255,0.8)'
            }}>
              © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
            </p>
          </div>
        </div>
>>>>>>> 669dd8fa30e1774aae73f00c8ed362f7f2c3c84b
      </div>
    );
  }

  // After login, show upload form and gallery
  return (
<<<<<<< HEAD
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
      <div style={{ background: 'transparent', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <h2 style={{ position: 'relative', zIndex: 2, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Upload Photo or Video</h2>
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Type *</label>
            <select
              value={uploadForm.type}
              onChange={e => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
              style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
            >
              <option value="image">Photo (JPEG, PNG, WebP, max 10MB)</option>
              <option value="video">Video (MP4, MOV, max 100MB)</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event *</label>
            <select
              value={uploadForm.event}
              onChange={e => setUploadForm(prev => ({ ...prev, event: e.target.value }))}
              style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              required
            >
              <option value="">Select an event</option>
              <option value="Family Gathering">Family Gathering</option>
              <option value="Temple Festival">Temple Festival</option>
              <option value="Wedding">Wedding</option>
              <option value="Pongal">Pongal</option>
              <option value="Onam">Onam</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>File *</label>
            <input
              type="file"
              required
              accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                if (uploadForm.type === 'image' && file.size > 10 * 1024 * 1024) {
                  alert('Photo must be less than 10MB');
                  return;
                }
                if (uploadForm.type === 'video' && file.size > 100 * 1024 * 1024) {
                  alert('Video must be less than 100MB');
                  return;
                }
                setUploadForm(prev => ({ ...prev, file }));
              }}
              style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </div>
          <button type="submit" style={{ position: 'relative', zIndex: 2, background: '#28a745', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
            Upload
          </button>
        </form>
=======
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
        <div style={{ background: 'transparent', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h2 style={{ position: 'relative', zIndex: 2, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Upload Photo or Video</h2>
          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Type *</label>
              <select
                value={uploadForm.type}
                onChange={e => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              >
                <option value="image">Photo (JPEG, PNG, WebP, max 10MB)</option>
                <option value="video">Video (MP4, MOV, max 100MB)</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event *</label>
              <select
                value={uploadForm.event}
                onChange={e => setUploadForm(prev => ({ ...prev, event: e.target.value }))}
                style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                required
              >
                <option value="">Select an event</option>
                <option value="Family Gathering">Family Gathering</option>
                <option value="Temple Festival">Temple Festival</option>
                <option value="Wedding">Wedding</option>
                <option value="Pongal">Pongal</option>
                <option value="Onam">Onam</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>File *</label>
              <input
                type="file"
                required
                accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (uploadForm.type === 'image' && file.size > 10 * 1024 * 1024) {
                    alert('Photo must be less than 10MB');
                    return;
                  }
                  if (uploadForm.type === 'video' && file.size > 100 * 1024 * 1024) {
                    alert('Video must be less than 100MB');
                    return;
                  }
                  setUploadForm(prev => ({ ...prev, file }));
                }}
                style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <button type="submit" style={{ position: 'relative', zIndex: 2, background: '#28a745', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
              Upload
            </button>
          </form>
        </div>
      </div>
      
      {/* Copyright Footer - Same as Home page */}
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem 0', 
        marginTop: 'calc(2rem - 5px)'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.5)',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <p style={{ 
            color: '#000', 
            fontSize: '0.9rem', 
            margin: 0,
            fontWeight: '600',
            textShadow: '0 1px 3px rgba(255,255,255,0.8)'
          }}>
            © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
          </p>
        </div>
>>>>>>> 669dd8fa30e1774aae73f00c8ed362f7f2c3c84b
      </div>
    </div>
  );
}

export default UploadPortal;

<style>{`
.upload-auth-btn {
  transition: background 0.2s, color 0.2s;
}
.upload-auth-btn:hover {
  background: #007bff !important;
  color: white !important;
}
`}</style> 