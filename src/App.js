import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Events from './components/Events';
import About from './components/About';
import Blog from './components/Blog';
import Contribute from './components/Contribute';
import Chat from './components/Chat';
import Upload from './components/Upload';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh', margin: 0 }}>
        <nav style={{ background: '#282c34', padding: '1rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#61dafb', fontWeight: 'bold', fontSize: '1.3rem' }}>Moothedath Ancestral House</span>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Home</Link>
          <Link to="/gallery" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Gallery</Link>
          <Link to="/events" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Events</Link>
          <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>About</Link>
          <Link to="/blog" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Blog</Link>
          <Link to="/upload" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Upload</Link>
          <Link to="/chat" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Chat</Link>
          <Link to="/contribute" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Contribute</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contribute" element={<Contribute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
