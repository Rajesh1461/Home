import React from 'react';

const features = [
  {
    icon: '🔐',
    title: 'Login / Registration',
    desc: 'Family members can securely log in or register to access upload and private features.'
  },
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
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px' }}>
      <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '1rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)', textAlign: 'center' }}>Welcome to The Moothedath Ancestral House Website</h1>
        <p style={{ color: '#222', fontSize: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)', textAlign: 'center' }}>
        A digital heritage platform dedicated to preserving and celebrating the charm, legacy, and stories of your ancestral home. This website serves as a virtual showcase and community hub, offering a rich visual and interactive experience for family members, guests, and<br />well-wishers.
      </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: 'transparent', borderRadius: '40px 8px 40px 8px', padding: '1.2rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 6 }}>{f.title}</div>
            <div style={{ 
              color: '#28a745', 
              fontSize: '0.98rem',
              textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
            }}>{f.desc}</div>
          </div>
        ))}
        </div>
      </div> {/* End of main content container */}
      
      {/* Developer Tag - now between main content and footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '0.5rem 0', 
        marginTop: '0.5rem',
        marginBottom: '40px'
      }}>
        <div className="developer-tag" style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <p style={{ 
            color: '#ffffff', 
            fontSize: '1rem', 
            margin: 0,
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(255,255,255,0.6), 1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
            animation: 'rainbow 4s linear infinite'
          }}>
            Developed by Rajesh Kumar Menon Moothedath
          </p>
        </div>
      </div>

      {/* Copyright Footer - bottom centered, fixed */}
      <div style={{ 
        position: 'fixed',
        left: '50%',
        bottom: 'calc(2rem - 5px)',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '1rem 2rem',
        display: 'inline-block',
        border: '1px solid rgba(40,167,69,0.15)'
        }}>
        <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
            © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
        </footer>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
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
        `}
      </style>
    </div>
  );
}

export default Home; 