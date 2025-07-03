import React from 'react';

const features = [
  {
    icon: '🖼️',
    title: 'Photo & Video Upload Portal',
    desc: 'Secure family login to upload images (JPEG, PNG, WebP) and videos (MP4, MOV) with captions, event names, dates, and tags.'
  },
  {
    icon: '🗂️',
    title: 'Photo & Video Gallery',
    desc: 'Filter by year, event, person, or location. Grid/slideshow view, fullscreen lightbox, download/share options.'
  },
  {
    icon: '🧭',
    title: 'Events Section',
    desc: 'Current, upcoming, and past events with photo streams, live updates, RSVP, countdowns, and archives.'
  },
  {
    icon: '💬',
    title: 'Live Chat & Guestbook',
    desc: 'Family/public chat, WhatsApp integration, guestbook for messages, memories, and photo comments.'
  },
  {
    icon: '🧾',
    title: 'About the Ancestral House',
    desc: 'History timeline, interactive family tree, architectural highlights, and renovation stories.'
  },
  {
    icon: '📜',
    title: 'Blog / Family Journal',
    desc: 'Stories from elders, renovation diaries, cooking traditions, and local culture.'
  },
  {
    icon: '📥',
    title: 'Contribution Section',
    desc: 'Volunteer signup, donation gateway, polls, and feedback forms.'
  }
];

function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '3rem auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem' }}>
      <h1 style={{ color: '#222', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Welcome to The Moothedath Ancestral House Website</h1>
      <p style={{ color: '#444', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
        A digital heritage platform dedicated to preserving and celebrating the charm, legacy, and stories of your ancestral home. This website serves as a virtual showcase and community hub, offering a rich visual and interactive experience for family members, guests, and well-wishers.
      </p>
      <h2 style={{ color: '#333', fontSize: '1.4rem', marginBottom: '1.2rem' }}>🌟 Key Features and Sections</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: '#f7fafc', borderRadius: 12, padding: '1.2rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 6 }}>{f.title}</div>
            <div style={{ color: '#555', fontSize: '0.98rem' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 