import React, { useState } from 'react';

// Sample family members for login
const familyMembers = [
  { id: 1, name: 'Father', email: 'father@family.com', role: 'Admin' },
  { id: 2, name: 'Mother', email: 'mother@family.com', role: 'Admin' },
  { id: 3, name: 'Grandfather', email: 'grandfather@family.com', role: 'Member' },
  { id: 4, name: 'Grandmother', email: 'grandmother@family.com', role: 'Member' },
  { id: 5, name: 'Uncle', email: 'uncle@family.com', role: 'Member' },
  { id: 6, name: 'Aunt', email: 'aunt@family.com', role: 'Member' }
];

function Upload({ media, setMedia }) {
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

  // --- Registration state ---
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

  // --- Registered users state ---
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = familyMembers.find(member => member.email === loginForm.email)
      || registeredUsers.find(member => member.email === loginForm.email && member.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      alert(`Welcome back, ${user.name || user.fullName}!`);
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
    if (!uploadForm.title || !uploadForm.file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    const newMedia = {
      id: Date.now(),
      title: uploadForm.title,
      type: uploadForm.type,
      url: URL.createObjectURL(uploadForm.file),
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: uploadForm.tags,
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

  // --- Registration handler ---
  const handleRegister = (e) => {
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
    // Add new user to registeredUsers
    setRegisteredUsers(prev => [
      ...prev,
      {
        fullName: registerForm.fullName,
        email: registerForm.email,
        mobile: registerForm.mobile,
        profilePhoto: registerForm.profilePhoto,
        password: registerForm.password,
        role: 'Member'
      }
    ]);
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
  };

  if (!isLoggedIn) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', position: 'relative', zIndex: 100 }}>
          <h1 style={{ position: 'relative', zIndex: 101, color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>Login / Registration</h1>
          <p style={{ position: 'relative', zIndex: 101, color: '#000', fontWeight: 'bold', marginBottom: '2rem' }}>
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
              <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦 Family Login</h2>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102 }}>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Family Email *</label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your family email"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password *</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
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
                  width: '32rem',
                  boxSizing: 'border-box'
                }}>
                  Login to Upload Portal
                </button>
              </form>
            </div>
          )}
          {activeTab === 'register' && (
            <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
              <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📝 Register</h2>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102 }}>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.fullName}
                    onChange={e => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mobile *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.mobile}
                    onChange={e => setRegisterForm(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="Enter your mobile number"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setRegisterForm(prev => ({ ...prev, profilePhoto: file }));
                      }
                    }}
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password *</label>
                  <input
                    type="password"
                    required
                    value={registerForm.password}
                    onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Enter your password again"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '32rem', boxSizing: 'border-box', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px', width: '32rem', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 103 }}>
                  <label style={{ position: 'relative', zIndex: 104, marginRight: '0.5rem', fontWeight: 'bold' }}>Agree to Terms & Conditions *</label>
                  <input
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
                  width: '32rem',
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
        
        {/* Copyright Footer - Same as Home page */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem 0', 
          marginTop: '100px'
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
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 101 }}>
          <div>
            <h1 style={{ position: 'relative', zIndex: 102, color: '#222', fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️ Photo & Video Upload Portal</h1>
            <p style={{ position: 'relative', zIndex: 102, color: '#555' }}>
              Welcome, {currentUser.name}! Upload and manage family memories.
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', position: 'relative', zIndex: 101 }}>
          <div>
            <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Upload New Media</h2>
            <form onSubmit={handleUpload} style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 102
            }}>
              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Media Type *</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="image">Image (JPEG, PNG, WebP)</option>
                  <option value="video">Video (MP4, MOV)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>File *</label>
                <input
                  type="file"
                  required
                  accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event</label>
                <select
                  value={uploadForm.event}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, event: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select an event</option>
                  {['Family Reunion', 'Temple Festival', 'Wedding', 'Pongal', 'Onam', 'Daily Life', 'Other'].map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                <select
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select a location</option>
                  {['Thinnai', 'Veranda', 'Kitchen', 'Prayer Room', 'Temple', 'Granary', 'Courtyard', 'Other'].map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>People in Media</label>
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
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Caption</label>
                <textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Describe the photo or video..."
                  style={{ position: 'relative', zIndex: 105, width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>

              <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103 }}>
                <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags</label>
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
                width: '32rem',
                boxSizing: 'border-box',
                marginBottom: '10px'
              }}>
                Register
              </button>
              {registerError && <div style={{ color: 'red', marginTop: '1rem' }}>{registerError}</div>}
              {registerSuccess && <div style={{ color: 'green', marginTop: '1rem' }}>{registerSuccess}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload; 