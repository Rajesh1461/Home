import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Reset the submitted state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', height: 'auto', paddingBottom: '120px' }}>
        <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>📞 Contact Us</h1>
        <p style={{ color: '#222', fontSize: '1.15rem', marginBottom: '2.5rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
          Get in touch with the Moothedath family. We'd love to hear from you!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
          {/* Contact Information */}
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1.5rem' }}>📍 Contact Information</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid rgb(40, 167, 69)' }}>
              <h3 style={{ color: '#007bff', fontSize: '1.2rem', marginBottom: '1rem' }}>🏠 Address</h3>
              <p style={{ color: '#000', lineHeight: 1.6, margin: 0, fontSize: '1.35rem' }}>
                The Moothedath House, Kallanthara, Erattakkulam Post, Para-Elappulli Via, Palakkad - 678 622. Kerala, India.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: 12, marginBottom: '1.5rem', border: '2px solid rgb(255, 193, 7)' }}>
              <h3 style={{ color: '#28a745', fontSize: '1.2rem', marginBottom: '1rem' }}>📞 Phone Numbers</h3>
                {/* Rainbow effect for phone numbers */}
                <style>
                  {`
                    .rainbow-text {
                      background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet, red);
                      background-size: 1400% 1400%;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                      text-fill-color: transparent;
                      font-weight: bold;
                      animation: rainbow-animate 6s ease-in-out infinite;
                      font-size: 1.25rem;
                    }
                    @keyframes rainbow-animate {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                  `}
                </style>
                <div style={{ color: '#fff', lineHeight: 1.6 }}>
                  <p style={{ margin: '0.5rem 0' }}><strong style={{ fontSize: '20px', WebkitTextStroke: '0.5px #000', color: '#fff' }}>Main House:</strong> <span className="rainbow-text" style={{ marginLeft: '9px' }}>Mr. SIVAN - Karanavar : +91 93631 10446</span></p>
                  <p style={{ margin: '0.5rem 0' }}><strong style={{ fontSize: '20px', WebkitTextStroke: '0.5px #000', color: '#fff' }}>Family Office:</strong> <span className="rainbow-text">Mrs. Sathya Bama : +91 86085 82519</span></p>
                  <p style={{ margin: '0.5rem 0' }}><strong style={{ fontSize: '20px', WebkitTextStroke: '0.5px #000', color: '#fff' }}>Support:</strong> <span className="rainbow-text">Mr. Rajesh Kumar S : +91 97896 55564</span></p>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: 12, marginBottom: '1.5rem', border: '2px solid rgb(255, 193, 7)' }}>
              <h3 style={{ color: '#ffc107', fontSize: '1.2rem', marginBottom: '1rem' }}>✉️ Email</h3>
              <div style={{ color: '#fff', lineHeight: 1.6 }}>
                <p style={{ margin: '0.5rem 0' }}><strong>Support:</strong><br />
                  <a href="mailto:family.moothedathhouse@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>family.moothedathhouse@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Remove the Visiting Hours box below */}
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1.5rem' }}>📝 Send us a Message</h2>
            
            {isSubmitted && (
              <div style={{ 
                background: '#d4edda', 
                color: '#155724', 
                padding: '1rem', 
                borderRadius: 8, 
                marginBottom: '1.5rem',
                border: '1px solid #c3e6cb'
              }}>
                ✅ Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'transparent', padding: '1.5rem', borderRadius: 12, border: '2px solid #6c757d' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="family-event">Family Event</option>
                  <option value="visit">Visit Request</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '1rem',
                    resize: 'vertical',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                  placeholder="Please share your message with us..."
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                onMouseLeave={(e) => e.target.style.background = '#007bff'}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1.5rem' }}>🗺️ Location</h2>
          <div style={{ 
            background: 'transparent', 
            padding: '2rem', 
            borderRadius: 12, 
            border: '2px solid #17a2b8',
            textAlign: 'center'
          }}>
            <p style={{ color: '#000', fontSize: '1.1rem', marginBottom: '1rem' }}>
              The Moothedath Ancestral House is located in the heart of Kerala, surrounded by the beautiful landscapes and rich cultural heritage of the region.
            </p>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: 8, 
              border: '1px dashed #6c757d',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <iframe
                title="Google Map - The Moothedath House"
                width="100%"
                height="350"
                frameBorder="0"
                style={{ border: 0, borderRadius: 8 }}
                src="https://www.google.com/maps?q=QQ2R%2BR67,+Chittur-Thathamangalam,+Kerala+678622&output=embed"
                allowFullScreen
              ></iframe>
              <p style={{ color: '#000', fontSize: '1rem', margin: '1rem 0 0 0' }}>
                📍 <strong>The Moothedath House</strong><br />
                The Moothedath House, Kallanthara, Erattakkulam Post, Para-Elappulli Via, Palakkad - 678 622. Kerala, India.
              </p>
            </div>
          </div>
        </div>
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

export default Contact; 