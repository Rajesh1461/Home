import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

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

// Remove static upcomingEvents, use Firestore instead
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: 'Veluthanmarude Temple',
    poojaType: '',
    contributor: '',
    otherLocation: ''
  });
  const [upcomingEventsState, setUpcomingEventsState] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  // Fetch upcoming events from Firestore on mount and listen for updates
  useEffect(() => {
    const q = query(collection(db, 'upcomingEvents'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpcomingEventsState(events);
      setLoadingUpcoming(false);
    });
    return () => unsubscribe();
  }, []);

  // Track RSVP per user per event (per session)
  const handleRSVP = async (eventId, status) => {
    setRsvpStatus(prev => {
      const prevStatus = prev[eventId];
      // Only update if changed
      if (prevStatus === status) return prev;
      // Find event
      const event = upcomingEventsState.find(e => e.id === eventId);
      if (!event) return prev;
      let newAttendees = event.attendees;
      if (status === 'yes' && prevStatus !== 'yes' && newAttendees < event.maxAttendees) {
        newAttendees++;
      } else if (status === 'no' && prevStatus === 'yes' && newAttendees > 0) {
        newAttendees--;
      }
      // Update Firestore
      updateDoc(doc(db, 'upcomingEvents', eventId), { attendees: newAttendees });
      return {
        ...prev,
        [eventId]: status
      };
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUploadEvent = async (e) => {
    e.preventDefault();
    const locationToUse = newEvent.location === 'Other Location' ? newEvent.otherLocation : newEvent.location;
    // Add the new event to Firestore
    await addDoc(collection(db, 'upcomingEvents'), {
      title: newEvent.title,
      date: newEvent.date,
      time: '',
      location: locationToUse,
      description: newEvent.poojaType,
      contributor: newEvent.contributor,
      status: 'upcoming',
      attendees: 0,
      maxAttendees: 30,
      countdown: newEvent.date ? `${newEvent.date}T00:00:00` : ''
    });
    setShowUploadModal(false);
    setNewEvent({ title: '', date: '', location: 'Veluthanmarude Temple', poojaType: '', contributor: '', otherLocation: '' });
  };

  return (
    <div>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', height: 'auto' }}>
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
          Upcoming Events ({upcomingEventsState.length})
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

      {/* Upload Event Button (only for Upcoming Events tab) */}
      {activeTab === 'upcoming' && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,123,255,0.12)'
            }}
          >
            + Upload Event
          </button>
        </div>
      )}

      {/* Upload Event Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <form onSubmit={handleUploadEvent} style={{
            background: 'white',
            padding: 32,
            borderRadius: 16,
            minWidth: 350,
            maxWidth: 420,
            width: '90%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            color: '#222',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <h2 style={{marginTop: 0, color: '#007bff'}}>Upload New Event</h2>
            <label htmlFor="event-title">Event Name</label>
            <input id="event-title" name="title" type="text" value={newEvent.title} onChange={e => setNewEvent(ev => ({...ev, title: e.target.value}))} required style={{width:'100%',marginBottom:8}} />
            <label htmlFor="event-date">Date</label>
            <input id="event-date" name="date" type="date" value={newEvent.date} onChange={e => setNewEvent(ev => ({...ev, date: e.target.value}))} required style={{width:'100%',marginBottom:8}} />
            <label htmlFor="event-location">Location</label>
            <select id="event-location" name="location" value={newEvent.location} onChange={e => setNewEvent(ev => ({...ev, location: e.target.value}))} style={{width:'100%',marginBottom:8}}>
              <option value="Veluthanmarude Temple">Veluthanmarude Temple</option>
              <option value="Moothedath Ancestral House">Moothedath Ancestral House</option>
              <option value="Kandakarnan Temple">Kandakarnan Temple</option>
              <option value="Other Location">Other Location</option>
            </select>
            {newEvent.location === 'Other Location' && (
              <input id="event-other-location" name="otherLocation" type="text" value={newEvent.otherLocation || ''} onChange={e => setNewEvent(ev => ({...ev, otherLocation: e.target.value}))} style={{width:'100%',marginBottom:8}} placeholder="Type the location here" />
            )}
            <label htmlFor="event-poojaType">Type of Pooja</label>
            <input id="event-poojaType" name="poojaType" type="text" value={newEvent.poojaType} onChange={e => setNewEvent(ev => ({...ev, poojaType: e.target.value}))} required style={{width:'100%',marginBottom:8}} placeholder="e.g. Sacred ceremony for temple renovation and consecration" />
            <label htmlFor="event-contributor">Pooja Contributed by</label>
            <input id="event-contributor" name="contributor" type="text" value={newEvent.contributor || ''} onChange={e => setNewEvent(ev => ({...ev, contributor: e.target.value}))} style={{width:'100%',marginBottom:8}} placeholder="e.g. Family of Suresh Kumar" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type='button' onClick={() => setShowUploadModal(false)} style={{background:'#ccc',border:'none',borderRadius:6,padding:'0.5rem 1rem'}}>Cancel</button>
              <button type='submit' style={{background:'#007bff',color:'white',border:'none',borderRadius:6,padding:'0.5rem 1rem'}}>Submit</button>
            </div>
          </form>
        </div>
      )}

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
                                      <p style={{ 
                      color: '#28a745', 
                      margin: '0 0 0.5rem 0', 
                      position: 'relative', 
                      zIndex: 2,
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>📅 {formatDate(event.date)} at {event.time}</p>
                    <p style={{ 
                      color: '#28a745', 
                      margin: '0 0 0.5rem 0', 
                      position: 'relative', 
                      zIndex: 2,
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>📍 {event.location}</p>
                  <p style={{ 
                  color: '#28a745', 
                  margin: '0 0 1rem 0', 
                  position: 'relative', 
                  zIndex: 2,
                  fontSize: '0.98rem',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                }}>{event.description}</p>
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
          {loadingUpcoming ? <p>Loading...</p> : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {upcomingEventsState.map(event => (
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
                      <p style={{ 
                        color: '#28a745', 
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.98rem',
                        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                      }}>📅 {formatDate(event.date)} at {event.time}</p>
                      <p style={{ 
                        color: '#28a745', 
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.98rem',
                        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                      }}>📍 {event.location}</p>
                      <p style={{ 
                        color: '#28a745', 
                        margin: '0 0 1rem 0',
                        fontSize: '0.98rem',
                        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                      }}>{event.description}</p>
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
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 6 }}>
                        <input
                          type="radio"
                          name={`rsvp-${event.id}`}
                          checked={rsvpStatus[event.id] === 'yes'}
                          onChange={() => handleRSVP(event.id, 'yes')}
                          style={{ marginRight: 6 }}
                        />
                        <span style={{ color: rsvpStatus[event.id] === 'yes' ? '#28a745' : '#333', fontWeight: rsvpStatus[event.id] === 'yes' ? 'bold' : 'normal' }}>
                          ✅ Yes, I'll attend
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 6 }}>
                        <input
                          type="radio"
                          name={`rsvp-${event.id}`}
                          checked={rsvpStatus[event.id] === 'no'}
                          onChange={() => handleRSVP(event.id, 'no')}
                          style={{ marginRight: 6 }}
                        />
                        <span style={{ color: rsvpStatus[event.id] === 'no' ? '#dc3545' : '#333', fontWeight: rsvpStatus[event.id] === 'no' ? 'bold' : 'normal' }}>
                          ❌ No, I can't attend
                        </span>
                      </label>
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
          )}
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
                    <p style={{ 
                      color: '#28a745', 
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>📅 {formatDate(event.date)}</p>
                    <p style={{ 
                      color: '#28a745', 
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>📍 {event.location}</p>
                    <p style={{ 
                      color: '#28a745', 
                      margin: '0 0 1rem 0',
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>{event.description}</p>
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
                          src={photo && photo.trim() ? photo : 'default.jpg'} 
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
    </div>
  );
}

export default Events; 