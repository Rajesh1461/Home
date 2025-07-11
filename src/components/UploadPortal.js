import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'image',
    file: null,
    event: '',
    location: '',
    people: [],
    caption: '',
    tags: [],
    setAsProfilePhoto: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const navigate = useNavigate();

  // Remove local auth state, rely on props from App.js

  const handleLogout = async () => {
    await signOut(auth);
    if (setAppIsLoggedIn) setAppIsLoggedIn(false);
    if (setAppCurrentUser) setAppCurrentUser({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e) => {
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
    try {
      // 1. Upload file to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}_${uploadForm.file.name}`);
      await uploadBytes(storageRef, uploadForm.file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Save metadata to Firestore
      await addDoc(collection(db, 'media'), {
        title: uploadForm.title || uploadForm.file.name,
        type: uploadForm.type,
        url: downloadURL,
        uploadedBy: currentUser ? currentUser.email : 'Anonymous',
        uploadDate: serverTimestamp(),
        event: uploadForm.event,
        location: uploadForm.location,
        caption: uploadForm.caption,
        tags: uploadForm.tags || []
      });

      // 3. If set as profile photo, update Firebase Auth profile and app state
      if (uploadForm.type === 'image' && uploadForm.setAsProfilePhoto && auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        if (setAppCurrentUser) setAppCurrentUser(prev => ({ ...prev, photoURL: downloadURL }));
        alert('Profile photo updated!');
      } else {
        alert('Media uploaded successfully!');
      }
      setUploadForm({
        title: '',
        type: 'image',
        file: null,
        event: '',
        location: '',
        people: [],
        caption: '',
        tags: [],
        setAsProfilePhoto: false
      });
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
      <div>
        <div style={{ padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
          <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>Photo & Video Upload Portal</h1>
          <p style={{ color: '#222', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.15rem', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
            Secure family login to upload and manage photos and videos from our ancestral house.
          </p>
          <div style={{ background: 'transparent', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>🔐 Authentication Required</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.3)', animation: 'pulse 2s ease-in-out infinite, rainbow 4s linear infinite' }}>
              You need to be logged in to access the Upload Portal. Please log in or register first.
            </p>
            <style>{`
              @keyframes pulse {
                0% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.02); }
                100% { opacity: 0.7; transform: scale(1); }
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
            <button
              onClick={() => navigate('/upload')}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              🔑 Go to Login / Register
            </button>
            <button
              onClick={() => navigate('/home')}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
        {/* Copyright Footer - bottom centered, not fixed */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
            © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
          </footer>
        </div>
      </div>
    );
  }

  // After login, show upload form and gallery
  return (
    <>
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
          <div style={{ background: 'transparent', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '2rem', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ position: 'relative', zIndex: 2, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Upload Photo or Video</h2>
          <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={e => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="Enter a title for your photo or video"
                />
              </div>
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
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                <select
                  value={uploadForm.location}
                  onChange={e => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                  style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select a location</option>
                  <option value="Thinnai">Thinnai</option>
                  <option value="Veranda">Veranda</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Prayer Room">Prayer Room</option>
                  <option value="Temple">Temple</option>
                  <option value="Granary">Granary</option>
                  <option value="Courtyard">Courtyard</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>People</label>
                <select
                  multiple
                  value={uploadForm.people}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions, option => option.value);
                    setUploadForm(prev => ({ ...prev, people: options }));
                  }}
                  style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, minHeight: '60px' }}
                >
                  {people.map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
                <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.95em' }}>
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple people.
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Caption</label>
                <textarea
                  value={uploadForm.caption}
                  onChange={e => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, minHeight: '60px' }}
                  placeholder="Add a caption or description (optional)"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ position: 'relative', zIndex: 2, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags</label>
                <input
                  type="text"
                  value={uploadForm.tagsInput || ''}
                  onChange={e => setUploadForm(prev => ({ ...prev, tagsInput: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && uploadForm.tagsInput) {
                      e.preventDefault();
                      if (!uploadForm.tags.includes(uploadForm.tagsInput.trim())) {
                        setUploadForm(prev => ({ ...prev, tags: [...prev.tags, prev.tagsInput.trim()], tagsInput: '' }));
                      }
                    }
                  }}
                  style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="Type a tag and press Enter"
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {uploadForm.tags && uploadForm.tags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#007bff', color: 'white', borderRadius: 12, padding: '0.3em 1em', fontSize: '0.95em', display: 'inline-flex', alignItems: 'center' }}>
                      {tag}
                      <button type="button" onClick={() => setUploadForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} style={{ marginLeft: 6, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                    </span>
                  ))}
                </div>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={uploadForm.setAsProfilePhoto}
                  onChange={e => setUploadForm(prev => ({ ...prev, setAsProfilePhoto: e.target.checked }))}
                  style={{ marginRight: 8 }}
                />
                Set as profile photo
              </label>
            </div>
            <button type="submit" style={{ position: 'relative', zIndex: 2, background: '#28a745', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
              Upload
            </button>
          </form>
        </div>
      </div>
      </div>
      {/* Copyright Footer - centered below main content, About page style */}
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
        <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
          © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
        </footer>
      </div>
    </div>
    </>
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