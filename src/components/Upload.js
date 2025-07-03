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

// Sample uploaded media
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
  const [media, setMedia] = useState(uploadedMedia);
  const [activeTab, setActiveTab] = useState('upload');
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

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>🖼️ Photo & Video Upload Portal</h1>
        <p style={{ color: '#555', marginBottom: '2rem' }}>
          Secure family login to upload and manage photos and videos from our ancestral house.
        </p>

        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦 Family Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Family Email *</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your family email"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password *</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <button type="submit" style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}>
              Login to Upload Portal
            </button>
          </form>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f8f9fa', 
            borderRadius: 8 
          }}>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Registered Family Members:</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {familyMembers.map(member => (
                <div key={member.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  background: '#fff',
                  borderRadius: 4
                }}>
                  <span>{member.name}</span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️ Photo & Video Upload Portal</h1>
          <p style={{ color: '#555' }}>
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
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'upload' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'upload' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'upload' ? 'bold' : 'normal'
          }}
        >
          Upload Media
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'manage' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'manage' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'manage' ? 'bold' : 'normal'
          }}
        >
          Manage Uploads
        </button>
      </div>

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📤 Upload New Media</h2>
            <form onSubmit={handleUpload} style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Media Type *</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="image">Image (JPEG, PNG, WebP)</option>
                  <option value="video">Video (MP4, MOV)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>File *</label>
                <input
                  type="file"
                  required
                  accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event</label>
                <select
                  value={uploadForm.event}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, event: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                <select
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>People in Media</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {people.map(person => (
                    <label key={person} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                      />
                      <span>{person}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Caption</label>
                <textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Describe the photo or video..."
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {uploadForm.tags.map(tag => (
                    <span key={tag} style={{ 
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
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['family', 'celebration', 'traditional', 'heritage', 'temple', 'cooking', 'festival'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      style={{
                        background: '#f8f9fa',
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
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%'
              }}>
                Upload Media
              </button>
            </form>
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📋 Upload Guidelines</h2>
            <div style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>📸 Photo Guidelines</h3>
                <ul style={{ color: '#555', paddingLeft: '1.5rem' }}>
                  <li>Supported formats: JPEG, PNG, WebP</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Recommended resolution: 1920x1080 or higher</li>
                  <li>Add descriptive titles and captions</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>🎥 Video Guidelines</h3>
                <ul style={{ color: '#555', paddingLeft: '1.5rem' }}>
                  <li>Supported formats: MP4, MOV</li>
                  <li>Maximum file size: 100MB</li>
                  <li>Recommended resolution: 1920x1080</li>
                  <li>Keep videos under 5 minutes for better loading</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>🏷️ Tagging Tips</h3>
                <ul style={{ color: '#555', paddingLeft: '1.5rem' }}>
                  <li>Tag people in the media</li>
                  <li>Include event names and dates</li>
                  <li>Add location tags</li>
                  <li>Use descriptive keywords</li>
                </ul>
              </div>

              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <p style={{ color: '#666', margin: 0 }}>
                  <strong>Privacy:</strong> Only family members can access uploaded media
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Uploads Section */}
      {activeTab === 'manage' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📁 Manage Uploads</h2>
          
          {/* Search and Filter */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: 12, 
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search by title, caption, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: '1rem'
              }}
            />
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: '1rem',
                minWidth: 150
              }}
            >
              <option value="All">All Events</option>
              {events.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: '1rem',
                minWidth: 150
              }}
            >
              <option value="All">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Media Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredMedia.map(item => (
              <div key={item.id} style={{ 
                background: '#fff', 
                borderRadius: 12, 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <video 
                    src={item.url} 
                    controls
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ color: '#222', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    By {item.uploadedBy} • {new Date(item.uploadDate).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#555', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{item.caption}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {item.tags.map(tag => (
                      <span key={tag} style={{ 
                        background: '#f8f9fa', 
                        color: '#666', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 4,
                        fontSize: '0.8rem'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888' }}>
                    <span>🎉 {item.event}</span>
                    <span>📍 {item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#666',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3>No media found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload; 