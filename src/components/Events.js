import React, { useState } from 'react';

// Sample events data
const currentEvents = [
  {
    id: 1,
    title: 'Family Reunion 2025',
    date: '2025-01-15',
    time: '10:00 AM',
    location: 'Moothedath Ancestral House',
    description: 'Annual family reunion with traditional feast and cultural programs',
    status: 'ongoing',
    attendees: 45,
    maxAttendees: 60,
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    updates: [
      { time: '2 hours ago', message: 'Traditional feast preparation started' },
      { time: '4 hours ago', message: 'Family members arriving from different cities' }
    ]
  }
];

const upcomingEvents = [
  {
    id: 2,
    title: 'Temple Renovation Ceremony',
    date: '2025-02-20',
    time: '6:00 AM',
    location: 'Family Temple',
    description: 'Sacred ceremony for temple renovation and consecration',
    status: 'upcoming',
    attendees: 12,
    maxAttendees: 30,
    countdown: '2025-02-20T06:00:00'
  },
  {
    id: 3,
    title: 'Pongal Celebration',
    date: '2025-01-14',
    time: '7:00 AM',
    location: 'Kitchen & Veranda',
    description: 'Traditional Pongal cooking and family gathering',
    status: 'upcoming',
    attendees: 28,
    maxAttendees: 40,
    countdown: '2025-01-14T07:00:00'
  }
];

const pastEvents = [
  {
    id: 4,
    title: 'Wedding Ceremony',
    date: '2024-12-15',
    location: 'Veranda & Thinnai',
    description: 'Beautiful wedding ceremony of family members',
    attendees: 80,
    photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
    guestbook: [
      { name: 'Uncle John', message: 'Beautiful ceremony, blessed memories!' },
      { name: 'Aunt Mary', message: 'The ancestral house looked magnificent' }
    ]
  },
  {
    id: 5,
    title: 'Temple Festival 2024',
    date: '2024-11-10',
    location: 'Family Temple',
    description: 'Annual temple festival with community participation',
    attendees: 120,
    photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400']
  }
];

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({});

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <div style={{ textAlign: 'center', background: 'transparent', padding: '0.5rem', borderRadius: 8, minWidth: 60 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{timeLeft.days || 0}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>Days</div>
      </div>
      <div style={{ textAlign: 'center', background: 'transparent', padding: '0.5rem', borderRadius: 8, minWidth: 60 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{timeLeft.hours || 0}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>Hours</div>
      </div>
      <div style={{ textAlign: 'center', background: 'transparent', padding: '0.5rem', borderRadius: 8, minWidth: 60 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{timeLeft.minutes || 0}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>Minutes</div>
      </div>
      <div style={{ textAlign: 'center', background: 'transparent', padding: '0.5rem', borderRadius: 8, minWidth: 60 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{timeLeft.seconds || 0}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>Seconds</div>
      </div>
    </div>
  );
}

function Events() {
  const [activeTab, setActiveTab] = useState('current');
  const [rsvpStatus, setRsvpStatus] = useState({});

  const handleRSVP = (eventId, status) => {
    setRsvpStatus(prev => ({
      ...prev,
      [eventId]: status
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
      <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>🧭 Events Section</h1>
      <p style={{ color: '#222', fontSize: '1.15rem', marginBottom: '2.5rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
        Stay connected with family events, celebrations, and important occasions at The Moothedath Ancestral House.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('current')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'current' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'current' ? 'bold' : 'normal'
          }}
        >
          Current Events ({currentEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'upcoming' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'upcoming' ? 'bold' : 'normal'
          }}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'past' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'past' ? 'bold' : 'normal'
          }}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Current Events */}
      {activeTab === 'current' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>🎉 Current Events</h2>
          {currentEvents.map(event => (
            <div key={event.id} style={{ 
              background: 'transparent', 
              borderRadius: 12, 
              padding: '2rem', 
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #28a745'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#222', fontSize: '1.4rem', margin: '0 0 0.5rem 0', position: 'relative', zIndex: 2 }}>{event.title}</h3>
                  <p style={{ color: '#666', margin: '0 0 0.5rem 0', position: 'relative', zIndex: 2 }}>📅 {formatDate(event.date)} at {event.time}</p>
                  <p style={{ color: '#666', margin: '0 0 0.5rem 0', position: 'relative', zIndex: 2 }}>📍 {event.location}</p>
                  <p style={{ color: '#555', margin: '0 0 1rem 0', position: 'relative', zIndex: 2 }}>{event.description}</p>
                </div>
                <div style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: 20,
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  LIVE NOW
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>📊 Attendance</h4>
                  <div style={{ background: 'transparent', padding: '1rem', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Attendees: {event.attendees}/{event.maxAttendees}</span>
                      <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                    </div>
                    <div style={{ 
                      background: '#e9ecef', 
                      height: 8, 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: '#28a745', 
                        height: '100%', 
                        width: `${(event.attendees / event.maxAttendees) * 100}%` 
                      }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>📸 Live Updates</h4>
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {event.updates.map((update, index) => (
                      <div key={index} style={{ 
                        background: 'transparent', 
                        padding: '0.75rem', 
                        borderRadius: 8, 
                        marginBottom: '0.5rem' 
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>{update.time}</div>
                        <div>{update.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      {activeTab === 'upcoming' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📅 Upcoming Events</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {upcomingEvents.map(event => (
              <div key={event.id} style={{ 
                background: 'transparent', 
                borderRadius: 12, 
                padding: '2rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #007bff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#222', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{event.title}</h3>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>📅 {formatDate(event.date)} at {event.time}</p>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>📍 {event.location}</p>
                    <p style={{ color: '#555', margin: '0 0 1rem 0' }}>{event.description}</p>
                  </div>
                  <div style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: 20,
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    UPCOMING
                  </div>
                </div>
                
                <CountdownTimer targetDate={event.countdown} />
                
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>RSVP</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button 
                      onClick={() => handleRSVP(event.id, 'yes')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: 6,
                        background: 'transparent',
                        color: rsvpStatus[event.id] === 'yes' ? '#28a745' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Yes, I'll attend
                    </button>
                    <button 
                      onClick={() => handleRSVP(event.id, 'no')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: 6,
                        background: 'transparent',
                        color: rsvpStatus[event.id] === 'no' ? '#dc3545' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ No, I can't attend
                    </button>
                  </div>
                  <div style={{ background: 'transparent', padding: '1rem', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Attendees: {event.attendees}/{event.maxAttendees}</span>
                      <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                    </div>
                    <div style={{ 
                      background: '#e9ecef', 
                      height: 8, 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: '#007bff', 
                        height: '100%', 
                        width: `${(event.attendees / event.maxAttendees) * 100}%` 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {activeTab === 'past' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Past Events Archive</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {pastEvents.map(event => (
              <div key={event.id} style={{ 
                background: 'transparent', 
                borderRadius: 12, 
                padding: '2rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #6c757d'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#222', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{event.title}</h3>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>📅 {formatDate(event.date)}</p>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>📍 {event.location}</p>
                    <p style={{ color: '#555', margin: '0 0 1rem 0' }}>{event.description}</p>
                    <p style={{ color: '#666', margin: '0 0 1rem 0' }}>👥 Attendees: {event.attendees}</p>
                  </div>
                  <div style={{ 
                    background: '#6c757d', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    borderRadius: 20,
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    COMPLETED
                  </div>
                </div>
                
                {event.photos && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>📸 Event Photos</h4>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                      {event.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={event.title}
                          style={{ 
                            width: 120, 
                            height: 80, 
                            objectFit: 'cover', 
                            borderRadius: 8,
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {event.guestbook && (
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>💬 Guestbook Entries</h4>
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {event.guestbook.map((entry, index) => (
                        <div key={index} style={{ 
                          background: 'transparent', 
                          padding: '0.75rem', 
                          borderRadius: 8, 
                          marginBottom: '0.5rem' 
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{entry.name}</div>
                          <div>{entry.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events; 