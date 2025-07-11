import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Sample guestbook entries
const initialGuestbook = [
  {
    id: 1,
    name: 'Uncle John',
    message: 'Beautiful ancestral house! The temple renovation looks amazing. Blessed to be part of this family heritage.',
    date: '2024-12-20',
    type: 'guestbook',
    photo: null
  },
  {
    id: 2,
    name: 'Aunt Mary',
    message: 'The Pongal celebration was wonderful. The traditional cooking methods are truly special.',
    date: '2024-12-18',
    type: 'guestbook',
    photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200'
  },
  {
    id: 3,
    name: 'Cousin Sarah',
    message: 'Thank you for preserving our family history. The blog stories are so inspiring!',
    date: '2024-12-15',
    type: 'guestbook',
    photo: null
  }
];

// Sample family chat messages
const initialFamilyChat = [
  {
    id: 1,
    name: 'Father',
    message: 'Temple renovation is progressing well. We should plan the consecration ceremony.',
    time: '10:30 AM',
    type: 'family'
  },
  {
    id: 2,
    name: 'Mother',
    message: 'I\'ll coordinate with the priest for the ceremony date.',
    time: '10:32 AM',
    type: 'family'
  },
  {
    id: 3,
    name: 'Grandmother',
    message: 'Don\'t forget to invite all family members. This is a special occasion.',
    time: '10:35 AM',
    type: 'family'
  }
];

function Chat() {
  const [activeTab, setActiveTab] = useState('guestbook');
  const [guestbook, setGuestbook] = useState(initialGuestbook);
  const [familyChat, setFamilyChat] = useState(initialFamilyChat);
  const [newGuestbookEntry, setNewGuestbookEntry] = useState({
    name: '',
    message: '',
    photo: null
  });
  const [newChatMessage, setNewChatMessage] = useState('');
  const [chatMode, setChatMode] = useState('family'); // 'family' or 'public'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Video chat states
  const [isVideoChatActive, setIsVideoChatActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  
  // Video refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Video chat functions
  const startVideoChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsVideoChatActive(true);
      setParticipants([{ id: 'local', name: currentUser?.displayName || currentUser?.email, stream }]);
      
      // Generate room ID
      const newRoomId = Math.random().toString(36).substring(2, 15);
      setRoomId(newRoomId);
      
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopVideoChat = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    setIsVideoChatActive(false);
    setIsInRoom(false);
    setParticipants([]);
    setRoomId('');
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } else {
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      alert('Unable to share screen.');
    }
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      setIsInRoom(true);
      // In a real implementation, you would connect to a signaling server here
      alert(`Joining room: ${roomId}`);
    } else {
      alert('Please enter a room ID');
    }
  };

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!newGuestbookEntry.name || !newGuestbookEntry.message) return;

    // Use current user's profile photo if logged in and no custom photo provided
    let photoToUse = newGuestbookEntry.photo;
    if (isLoggedIn && currentUser?.photoURL && !newGuestbookEntry.photo) {
      photoToUse = currentUser.photoURL;
    }

    const newEntry = {
      id: Date.now(),
      name: newGuestbookEntry.name,
      message: newGuestbookEntry.message,
      photo: photoToUse,
      date: new Date().toISOString().split('T')[0],
      type: 'guestbook'
    };

    setGuestbook([newEntry, ...guestbook]);
    setNewGuestbookEntry({ name: '', message: '', photo: null });
    alert('Thank you for your message! It has been added to our guestbook.');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !isLoggedIn) return;

    const newMessage = {
      id: Date.now(),
      name: getUserDisplayName(currentUser) || 'Family Member',
      message: newChatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'family'
    };

    setFamilyChat([...familyChat, newMessage]);
    setNewChatMessage('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return '';
    
    // First try displayName
    if (user.displayName && user.displayName.trim()) {
      return user.displayName;
    }
    
    // If no displayName, try to extract name from email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Convert email username to proper name (e.g., "rajeshkumar75" -> "Rajesh Kumar")
      return emailName
        .replace(/[0-9]/g, '') // Remove numbers
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim() || emailName; // Fallback to original email name if empty
    }
    
    return 'User';
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', minHeight: '45vh' }}>
        <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>💬 Live Chat & Guestbook</h1>
        <p style={{ color: '#222', marginBottom: '2rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
          Connect with family members through live chat, video calls, and leave your memories in our ancestral guestbook.
        </p>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('guestbook')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: activeTab === 'guestbook' ? '#007bff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === 'guestbook' ? 'bold' : 'normal'
            }}
          >
            Guestbook
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: activeTab === 'chat' ? '#007bff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === 'chat' ? 'bold' : 'normal'
            }}
          >
            Live Chat {!isLoggedIn && '🔒'}
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: activeTab === 'video' ? '#007bff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === 'video' ? 'bold' : 'normal'
            }}
          >
            Video Chat {!isLoggedIn && '🔒'}
          </button>
          <button 
            onClick={() => setActiveTab('whatsapp')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: activeTab === 'whatsapp' ? '#007bff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === 'whatsapp' ? 'bold' : 'normal'
            }}
          >
            WhatsApp
          </button>
        </div>

        {/* Guestbook Section */}
        {activeTab === 'guestbook' && isLoggedIn && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h2 style={{ color: '#000', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>📖 Ancestral Guestbook</h2>
              <div style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxHeight: 600,
                overflowY: 'auto'
              }}>
                {guestbook.map(entry => (
                  <div key={entry.id} style={{ 
                    borderBottom: '1px solid #eee', 
                    padding: '1rem 0',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                      {entry.photo && (
                        <img 
                          src={entry.photo && entry.photo.trim() ? entry.photo : 'default.jpg'} 
                          alt={entry.name}
                          style={{ 
                            width: 50, 
                            height: 50, 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            border: '2px solid #007bff',
                            flexShrink: 0
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: '#000', margin: 0, fontWeight: 'bold' }}>{entry.name}</h4>
                          <span style={{ color: '#333', fontSize: '0.9rem', fontWeight: '500' }}>{formatDate(entry.date)}</span>
                        </div>
                        <p style={{ color: '#000', margin: 0, lineHeight: 1.5, fontWeight: '500' }}>{entry.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ color: '#000', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>✍️ Leave a Message</h2>
              <form onSubmit={handleGuestbookSubmit} style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {isLoggedIn && currentUser?.photoURL && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(0,123,255,0.1)', borderRadius: 8 }}>
                    <img 
                      src={currentUser.photoURL} 
                      alt="Your profile"
                      style={{ 
                        width: 40, 
                        height: 40, 
                        objectFit: 'cover', 
                        borderRadius: '50%',
                        border: '2px solid #007bff'
                      }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#007bff' }}>Logged in as: {getUserDisplayName(currentUser)}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Your profile photo will be used automatically</p>
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newGuestbookEntry.name}
                    onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isLoggedIn ? getUserDisplayName(currentUser) : "Enter your name"}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Message *</label>
                  <textarea
                    required
                    value={newGuestbookEntry.message}
                    onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your memories, blessings, or thoughts about our ancestral house..."
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 120 }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>
                    Photo URL {isLoggedIn && currentUser?.photoURL ? '(Optional - will use your profile photo if left empty)' : '(Optional)'}
                  </label>
                  <input
                    type="url"
                    value={newGuestbookEntry.photo || ''}
                    onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, photo: e.target.value }))}
                    placeholder={isLoggedIn && currentUser?.photoURL ? "Leave empty to use your profile photo" : "https://example.com/photo.jpg"}
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
                  Add to Guestbook
                </button>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'guestbook' && !isLoggedIn && (
          <div style={{ 
            background: 'transparent', 
            padding: '2rem', 
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center',
            margin: '2rem auto',
            maxWidth: 500
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ color: '#222', marginBottom: '1rem' }}>Family Chat Access Required</h3>
            <p style={{ color: '#555', marginBottom: '2rem' }}>
              This chat is only available to verified family members. Please log in to access the family chat.
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔑 Login to Access Chat
            </button>
          </div>
        )}

        {/* Live Chat Section */}
        {activeTab === 'chat' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💭 Live Chat</h2>
              
              {!isLoggedIn ? (
                <div style={{ 
                  background: 'transparent', 
                  padding: '2rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                  <h3 style={{ color: '#222', marginBottom: '1rem' }}>Family Chat Access Required</h3>
                  <p style={{ color: '#555', marginBottom: '2rem' }}>
                    This chat is only available to verified family members. Please log in to access the family chat.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    🔑 Login to Access Chat
                  </button>
                </div>
              ) : (
                <div style={{ 
                  background: 'transparent', 
                  padding: '1rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  height: 500,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Welcome Message */}
                  <div style={{ 
                    background: '#e8f5e8', 
                    padding: '0.75rem', 
                    borderRadius: 8, 
                    marginBottom: '1rem',
                    border: '1px solid #28a745'
                  }}>
                    <p style={{ margin: 0, color: '#155724', fontSize: '0.9rem' }}>
                      👋 Welcome, {getUserDisplayName(currentUser)}! You're now in the family chat.
                    </p>
                  </div>

                  {/* Chat Mode Toggle */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    background: 'transparent',
                    borderRadius: 8
                  }}>
                    <button
                      onClick={() => setChatMode('family')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: 6,
                        background: chatMode === 'family' ? '#007bff' : '#e9ecef',
                        color: chatMode === 'family' ? 'white' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      Family Only
                    </button>
                    <button
                      onClick={() => setChatMode('public')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: 6,
                        background: chatMode === 'public' ? '#007bff' : '#e9ecef',
                        color: chatMode === 'public' ? 'white' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      Public Chat
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '1rem',
                    background: 'transparent',
                    borderRadius: 8,
                    marginBottom: '1rem'
                  }}>
                    {familyChat.map(message => (
                      <div key={message.id} style={{ 
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: message.name === getUserDisplayName(currentUser) ? '#007bff' : '#fff',
                        color: message.name === getUserDisplayName(currentUser) ? 'white' : '#333',
                        borderRadius: 8,
                        maxWidth: '80%',
                        marginLeft: message.name === getUserDisplayName(currentUser) ? 'auto' : '0'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <strong>{message.name}</strong>
                          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{message.time}</span>
                        </div>
                        <div>{message.message}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      style={{ 
                        flex: 1, 
                        padding: '0.75rem', 
                        border: '1px solid #ddd', 
                        borderRadius: 6 
                      }}
                    />
                    <button type="submit" style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}>
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📱 Chat Features</h2>
              <div style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {isLoggedIn ? (
                  <>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>Family Chat</h3>
                      <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                        Private chat for family members to discuss events, plans, and family matters.
                      </p>
                      <ul style={{ color: '#666', paddingLeft: '1.5rem' }}>
                        <li>Real-time messaging</li>
                        <li>Family-only access</li>
                        <li>Event coordination</li>
                        <li>Photo sharing</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>Public Chat</h3>
                      <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                        Open chat for guests and extended family to connect and share.
                      </p>
                      <ul style={{ color: '#666', paddingLeft: '1.5rem' }}>
                        <li>Guest-friendly</li>
                        <li>Community building</li>
                        <li>Cultural exchange</li>
                        <li>Moderated content</li>
                      </ul>
                    </div>

                    <div style={{ 
                      background: '#e8f5e8', 
                      padding: '1rem', 
                      borderRadius: 8,
                      textAlign: 'center',
                      border: '1px solid #28a745'
                    }}>
                      <p style={{ color: '#155724', margin: '0 0 0.5rem 0' }}>✅ You're logged in as: {currentUser?.displayName || currentUser?.email}</p>
                      <button 
                        onClick={() => auth.signOut()}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{ color: '#222', marginBottom: '1rem' }}>Authentication Required</h3>
                    <p style={{ color: '#555', marginBottom: '2rem' }}>
                      Only verified family members can access the chat features. Please log in to continue.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/login'}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      🔑 Login Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Chat Section */}
        {activeTab === 'video' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📹 Video Chat</h2>
              
              {!isLoggedIn ? (
                <div style={{ 
                  background: 'transparent', 
                  padding: '2rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                  <h3 style={{ color: '#222', marginBottom: '1rem' }}>Video Chat Access Required</h3>
                  <p style={{ color: '#555', marginBottom: '2rem' }}>
                    Video chat is only available to verified family members. Please log in to access video calls.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    🔑 Login to Access Video Chat
                  </button>
                </div>
              ) : (
                <div style={{ 
                  background: 'transparent', 
                  padding: '1rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minHeight: 500
                }}>
                  {/* Video Display */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    minHeight: 300
                  }}>
                    {/* Local Video */}
                    <div style={{ 
                      background: '#000', 
                      borderRadius: 8, 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          minHeight: 200
                        }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0.5rem', 
                        left: '0.5rem', 
                        background: 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 4,
                        fontSize: '0.8rem'
                      }}>
                        You
                      </div>
                    </div>

                    {/* Remote Video */}
                    <div style={{ 
                      background: '#000', 
                      borderRadius: 8, 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          minHeight: 200
                        }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0.5rem', 
                        left: '0.5rem', 
                        background: 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 4,
                        fontSize: '0.8rem'
                      }}>
                        Family Member
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '1rem'
                  }}>
                    {!isVideoChatActive ? (
                      <button
                        onClick={startVideoChat}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1.5rem',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        📹 Start Video Chat
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={toggleVideo}
                          style={{
                            background: isVideoEnabled ? '#007bff' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          {isVideoEnabled ? '📹' : '🚫'} Video
                        </button>
                        <button
                          onClick={toggleAudio}
                          style={{
                            background: isAudioEnabled ? '#007bff' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          {isAudioEnabled ? '🎤' : '🚫'} Audio
                        </button>
                        <button
                          onClick={toggleScreenShare}
                          style={{
                            background: isScreenSharing ? '#ffc107' : '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          {isScreenSharing ? '🖥️' : '🖥️'} Screen
                        </button>
                        <button
                          onClick={stopVideoChat}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          🚫 End Call
                        </button>
                      </>
                    )}
                  </div>

                  {/* Room Management */}
                  {isVideoChatActive && (
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '1rem', 
                      borderRadius: 8,
                      marginBottom: '1rem'
                    }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Room Management</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          placeholder="Enter room ID to join"
                          style={{ 
                            flex: 1, 
                            padding: '0.5rem', 
                            border: '1px solid #ddd', 
                            borderRadius: 4,
                            minWidth: 150
                          }}
                        />
                        <button
                          onClick={joinRoom}
                          style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                        >
                          Join Room
                        </button>
                      </div>
                      {roomId && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                          Room ID: <strong>{roomId}</strong> (Share this with family members)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📹 Video Features</h2>
              <div style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {isLoggedIn ? (
                  <>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>Video Chat Features</h3>
                      <ul style={{ color: '#666', paddingLeft: '1.5rem' }}>
                        <li>HD video and audio</li>
                        <li>Screen sharing</li>
                        <li>Room-based calls</li>
                        <li>Privacy controls</li>
                        <li>Family-only access</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>How to Use</h3>
                      <ol style={{ color: '#666', paddingLeft: '1.5rem' }}>
                        <li>Click "Start Video Chat"</li>
                        <li>Allow camera/microphone access</li>
                        <li>Share room ID with family</li>
                        <li>Use controls to manage call</li>
                      </ol>
                    </div>

                    <div style={{ 
                      background: '#e8f5e8', 
                      padding: '1rem', 
                      borderRadius: 8,
                      textAlign: 'center',
                      border: '1px solid #28a745'
                    }}>
                      <p style={{ color: '#155724', margin: '0 0 0.5rem 0' }}>✅ Video chat ready for: {currentUser?.displayName || currentUser?.email}</p>
                      <p style={{ color: '#155724', margin: 0, fontSize: '0.9rem' }}>
                        Make sure your camera and microphone are working
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{ color: '#222', marginBottom: '1rem' }}>Authentication Required</h3>
                    <p style={{ color: '#555', marginBottom: '2rem' }}>
                      Only verified family members can access video chat. Please log in to continue.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/login'}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      🔑 Login Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Integration */}
        {activeTab === 'whatsapp' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📱 WhatsApp Integration</h2>
              <div style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '1rem',
                    color: '#25d366'
                  }}>
                    💬
                  </div>
                  <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>Connect via WhatsApp</h3>
                  <p style={{ color: '#555' }}>
                    Get instant responses and stay connected with family members through WhatsApp.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <a 
                    href="https://wa.me/917904926096?text=Hello%20from%20Moothedath%20Ancestral%20House%20website!"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#25d366',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: 8,
                      textDecoration: 'none',
                      textAlign: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>📱</span>
                    <span>Chat with Family</span>
                  </a>

                  <a 
                    href="https://wa.me/917904926096?text=I%20would%20like%20to%20volunteer%20for%20the%20ancestral%20house%20events"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#007bff',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: 8,
                      textDecoration: 'none',
                      textAlign: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🤝</span>
                    <span>Volunteer Interest</span>
                  </a>

                  <a 
                    href="https://wa.me/917904926096?text=I%20would%20like%20to%20make%20a%20donation%20to%20the%20ancestral%20house"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#28a745',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: 8,
                      textDecoration: 'none',
                      textAlign: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>💝</span>
                    <span>Make a Donation</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📞 Contact Information</h2>
              <div style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>Family Contact</h3>
                  <p style={{ color: '#222', marginBottom: '0.5rem', fontSize: '16px', marginLeft: '20px' }}>
                    <strong>Phone:</strong> +91 97896 55564
                  </p>
                  <p style={{ color: '#222', marginBottom: '0.5rem', fontSize: '16px', marginLeft: '20px' }}>
                    <strong>Email:</strong> family.moothedathhouse@gmail.com
                  </p>
                  <p style={{ color: '#222', marginBottom: '0.5rem', fontSize: '16px', marginLeft: '20px' }}>
                    <strong>Address:</strong> Moothedath Ancestral House, Kerala, India
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#222', marginBottom: '0.5rem' }}>WhatsApp Groups</h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div style={{ 
                      background: 'transparent', 
                      padding: '0.75rem', 
                      borderRadius: 6 
                    }}>
                      <strong>Family Group:</strong> Moothedath Family
                    </div>
                    <div style={{ 
                      background: 'transparent', 
                      padding: '0.75rem', 
                      borderRadius: 6 
                    }}>
                      <strong>Events Group:</strong> Ancestral House Events
                    </div>
                    <div style={{ 
                      background: 'transparent', 
                      padding: '0.75rem', 
                      borderRadius: 6 
                    }}>
                      <strong>Volunteers Group:</strong> House Volunteers
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: 'transparent', 
                  padding: '1rem', 
                  borderRadius: 8,
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', margin: 0 }}>
                    <strong>Response Time:</strong> Usually within 2-4 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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

export default Chat; 