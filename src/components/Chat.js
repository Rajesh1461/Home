import React, { useState } from 'react';

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

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!newGuestbookEntry.name || !newGuestbookEntry.message) return;

    const newEntry = {
      id: Date.now(),
      name: newGuestbookEntry.name,
      message: newGuestbookEntry.message,
      photo: newGuestbookEntry.photo,
      date: new Date().toISOString().split('T')[0],
      type: 'guestbook'
    };

    setGuestbook([newEntry, ...guestbook]);
    setNewGuestbookEntry({ name: '', message: '', photo: null });
    alert('Thank you for your message! It has been added to our guestbook.');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      name: 'You',
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

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
      <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>💬 Live Chat & Guestbook</h1>
      <p style={{ color: '#222', marginBottom: '2rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
        Connect with family members through live chat and leave your memories in our ancestral guestbook.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
          Live Chat
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
      {activeTab === 'guestbook' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📖 Ancestral Guestbook</h2>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#222', margin: 0 }}>{entry.name}</h4>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{formatDate(entry.date)}</span>
                  </div>
                  <p style={{ color: '#555', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>{entry.message}</p>
                  {entry.photo && (
                    <img 
                      src={entry.photo} 
                      alt={entry.name}
                      style={{ 
                        width: 100, 
                        height: 80, 
                        objectFit: 'cover', 
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>✍️ Leave a Message</h2>
            <form onSubmit={handleGuestbookSubmit} style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Your Name *</label>
                <input
                  type="text"
                  required
                  value={newGuestbookEntry.name}
                  onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message *</label>
                <textarea
                  required
                  value={newGuestbookEntry.message}
                  onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Share your memories, blessings, or thoughts about our ancestral house..."
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 120 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Photo URL (Optional)</label>
                <input
                  type="url"
                  value={newGuestbookEntry.photo || ''}
                  onChange={(e) => setNewGuestbookEntry(prev => ({ ...prev, photo: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
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

      {/* Live Chat Section */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💭 Live Chat</h2>
            <div style={{ 
              background: 'transparent', 
              padding: '1rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: 500,
              display: 'flex',
              flexDirection: 'column'
            }}>
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
                    background: message.name === 'You' ? '#007bff' : '#fff',
                    color: message.name === 'You' ? 'white' : '#333',
                    borderRadius: 8,
                    maxWidth: '80%',
                    marginLeft: message.name === 'You' ? 'auto' : '0'
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
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📱 Chat Features</h2>
            <div style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
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
                background: 'transparent', 
                padding: '1rem', 
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>Need immediate help?</p>
                <button style={{
                  background: '#25d366',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  💬 Chat on WhatsApp
                </button>
              </div>
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
                  href="https://wa.me/919876543210?text=Hello%20from%20Moothedath%20Ancestral%20House%20website!"
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
                  href="https://wa.me/919876543210?text=I%20would%20like%20to%20volunteer%20for%20the%20ancestral%20house%20events"
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
                  href="https://wa.me/919876543210?text=I%20would%20like%20to%20make%20a%20donation%20to%20the%20ancestral%20house"
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
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> family@moothedathhouse.com
                </p>
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
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
      
      {/* Copyright Footer */}
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
    </div>
  );
}

export default Chat; 