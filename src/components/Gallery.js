import React, { useState } from 'react';

// Sample data for demonstration
const sampleMedia = [
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
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    title: 'Prayer Room',
    year: 2024,
    event: 'Daily Prayer',
    person: 'Elders',
    location: 'Prayer Room',
    caption: 'Morning prayers in the sacred prayer room'
  },
  {
    id: 6,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    title: 'Granary',
    year: 2023,
    event: 'Harvest',
    person: 'Farmers',
    location: 'Granary',
    caption: 'Traditional granary storing harvested grains'
  }
];

function Gallery({ media }) {
  // Use sampleMedia as fallback if media is empty or not provided
  const galleryMedia = (media && Array.isArray(media) && media.length > 0) ? media : sampleMedia;
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedPerson, setSelectedPerson] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Build filter options from galleryMedia
  const years = [...new Set(galleryMedia.map(item => item.year))].sort((a, b) => b - a);
  const events = [...new Set(galleryMedia.map(item => item.event))];
  const persons = [...new Set(galleryMedia.map(item => item.person))];
  const locations = [...new Set(galleryMedia.map(item => item.location))];

  const filteredMedia = galleryMedia.filter(item => {
    return (selectedYear === 'All' || item.year === selectedYear) &&
           (selectedEvent === 'All' || item.event === selectedEvent) &&
           (selectedPerson === 'All' || item.person === selectedPerson) &&
           (selectedLocation === 'All' || item.location === selectedLocation);
  });

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
      <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>Photo & Video Gallery</h1>
      <p style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '1.15rem', marginBottom: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
        Explore memories from The Moothedath Ancestral House. Filter by year, event, person, or location.
      </p>

      {/* Filters */}
      <div style={{ 
        background: 'transparent', 
        padding: '1.2rem', 
        borderRadius: 12, 
        marginBottom: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }}
          >
            <option value="All">All Years</option>
            {years.map(year => (
              <option key={year} value={year} style={{ position: 'relative', zIndex: 2 }}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>Event:</label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }}
          >
            <option value="All">All Events</option>
            {events.map(event => (
              <option key={event} value={event} style={{ position: 'relative', zIndex: 2 }}>{event}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>Person:</label>
          <select 
            value={selectedPerson} 
            onChange={(e) => setSelectedPerson(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }}
          >
            <option value="All">All People</option>
            {persons.map(person => (
              <option key={person} value={person} style={{ position: 'relative', zIndex: 2 }}>{person}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>Location:</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }}
          >
            <option value="All">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location} style={{ position: 'relative', zIndex: 2 }}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '0.5rem', color: '#666', position: 'relative', zIndex: 2 }}>
        Showing {filteredMedia.length} of {galleryMedia.length} items
      </div>

      {/* Gallery Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem',
        position: 'relative',
        zIndex: 20
      }}>
        {filteredMedia.map(item => (
          <div 
            key={item.id} 
            style={{ 
              background: 'transparent', 
              borderRadius: 12, 
              overflow: 'hidden', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              position: 'relative',
              zIndex: 21
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => setSelectedMedia(item)}
          >
            <img 
              src={item.url} 
              alt={item.title}
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <div style={{ padding: '0.5rem' }}>
              <h3 style={{ margin: '0 0 0.2rem 0', color: '#222', position: 'relative', zIndex: 2 }}>{item.title}</h3>
              <p style={{ margin: '0 0 0.2rem 0', color: '#666', fontSize: '0.9rem', position: 'relative', zIndex: 2 }}>{item.caption}</p>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#888', position: 'relative', zIndex: 2 }}>
                <span>📅 {item.year}</span>
                <span>🎉 {item.event}</span>
                <span>👥 {item.person}</span>
                <span>📍 {item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedMedia(null)}
        >
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
            <button 
              onClick={() => setSelectedMedia(null)}
              style={{
                position: 'absolute',
                top: -40,
                right: 0,
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <img 
              src={selectedMedia.url} 
              alt={selectedMedia.title}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: -60, 
              left: 0, 
              right: 0, 
              color: 'white', 
              textAlign: 'center' 
            }}>
              <h3>{selectedMedia.title}</h3>
              <p>{selectedMedia.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery; 