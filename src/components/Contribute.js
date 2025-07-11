import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import QRCode from 'qrcode';

// Sample volunteer opportunities
const volunteerOpportunities = [
  {
    id: 1,
    title: 'Event Help',
    description: 'Assist with family events, celebrations, and community gatherings',
    skills: ['Event Planning', 'Cooking', 'Decoration', 'Photography'],
    timeCommitment: '2-4 hours per event',
    location: 'Ancestral House',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Temple Maintenance',
    description: 'Help maintain the family temple and assist with daily prayers',
    skills: ['Cleaning', 'Gardening', 'Religious Knowledge'],
    timeCommitment: '1-2 hours weekly',
    location: 'Family Temple',
    status: 'Open'
  },
  {
    id: 3,
    title: 'House Cleanup',
    description: 'Regular cleaning and maintenance of the ancestral house',
    skills: ['Cleaning', 'Organization', 'Attention to Detail'],
    timeCommitment: '3-4 hours monthly',
    location: 'Ancestral House',
    status: 'Open'
  },
  {
    id: 4,
    title: 'Documentation',
    description: 'Help document family history, stories, and traditions',
    skills: ['Writing', 'Photography', 'Interviewing', 'Research'],
    timeCommitment: 'Flexible',
    location: 'Remote/On-site',
    status: 'Open'
  }
];

// Sample polls
const activePolls = [
  {
    id: 1,
    question: 'What type of family event would you like to see next?',
    options: [
      { id: 1, text: 'Cultural Workshop', votes: 15 },
      { id: 2, text: 'Family Reunion', votes: 23 },
      { id: 3, text: 'Cooking Class', votes: 8 },
      { id: 4, text: 'Temple Festival', votes: 12 }
    ],
    totalVotes: 58,
    endDate: '2025-02-15'
  },
  {
    id: 2,
    question: 'Which area of the house needs renovation priority?',
    options: [
      { id: 1, text: 'Kitchen', votes: 18 },
      { id: 2, text: 'Prayer Room', votes: 7 },
      { id: 3, text: 'Veranda', votes: 14 },
      { id: 4, text: 'Temple Courtyard', votes: 11 }
    ],
    totalVotes: 50,
    endDate: '2025-01-30'
  }
];

// Sample donation projects
const donationProjects = [
  {
    id: 1,
    title: 'Ayilya Pooja',
    description: 'Support the monthly Ayilya Pooja rituals and offerings at the family temple.',
    target: 0,
    raised: 0,
    image: 'Veluthan.jpg',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Maariyamman Festival',
    description: 'Contribute to the annual Maariyamman Festival celebrations and arrangements.',
    target: 0,
    raised: 0,
    image: 'maariyamman.jpg',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Others',
    description: 'Donate for other family, temple, or house needs and special occasions.',
    target: 10000,
    raised: 2500,
    image: 'volunteer.jpg',
    status: 'Active'
  }
];

function Contribute({ currentUser = {}, isLoggedIn = false }) {
  const [activeTab, setActiveTab] = useState('volunteer');
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    opportunity: '',
    skills: [],
    availability: '',
    message: ''
  });
  const [donationForm, setDonationForm] = useState({
    name: '',
    email: '',
    amount: '',
    project: '',
    anonymous: false,
    message: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });
  const [votedPolls, setVotedPolls] = useState({});
  // Add state for request modal and form
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: (currentUser && currentUser.name) || '',
    email: (currentUser && currentUser.email) || '',
    photo: (currentUser && currentUser.photoURL) || '',
    mobile: (currentUser && currentUser.mobile) || '',
    amount: '',
    purpose: '',
    closingDate: '',
    remarks: ''
  });
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);



  // Fetch requests from Firestore
  useEffect(() => {
    if (activeTab === 'requests') {
      setLoadingRequests(true);
      getDocs(collection(db, 'donationRequests')).then(snapshot => {
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingRequests(false);
      });
    }
  }, [activeTab, requestSuccess]);

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your interest in volunteering! We will contact you soon.');
    setVolunteerForm({
      name: '',
      email: '',
      phone: '',
      opportunity: '',
      skills: [],
      availability: '',
      message: ''
    });
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    if (!donationForm.amount || !donationForm.name || !donationForm.email || !donationForm.project) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      // Create a UPI payment link for QR code
      const upiId = 'rajeshkumar757575@okicici';
      const upiLink = `upi://pay?pa=${upiId}&pn=The%20Moothedath%20Ancestral%20House&am=${donationForm.amount}&tn=${encodeURIComponent(donationForm.project)}&cu=INR`;
      
      // Generate QR code
      QRCode.toDataURL(upiLink, { width: 300, margin: 2 }, (err, url) => {
        if (err) {
          console.error('Error generating QR code:', err);
          alert('Error generating QR code. Please try again.');
          return;
        }
        setQrCodeDataUrl(url);
        setShowQRCode(true);
      });
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating payment QR code. Please try again.');
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackForm({
      name: '',
      email: '',
      category: '',
      message: ''
    });
  };

  const handleVote = (pollId, optionId) => {
    if (votedPolls[pollId]) {
      alert('You have already voted in this poll.');
      return;
    }
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    alert('Thank you for voting!');
  };

  const calculatePercentage = (raised, target) => {
    return Math.round((raised / target) * 100);
  };

  // Update handle for request form submit to save to Firestore
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'donationRequests'), {
        ...requestForm,
        submittedAt: serverTimestamp(),
        recommendedBy: [],
        notRecommendedBy: [],
        user: currentUser?.email || 'Anonymous'
      });
      setRequestSuccess(true);
      setShowRequestModal(false);
      setRequestForm({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        photo: currentUser?.photoURL || '',
        mobile: currentUser?.mobile || '',
        amount: '',
        purpose: '',
        closingDate: '',
        remarks: ''
      });
    } catch (error) {
      alert('Failed to submit request: ' + error.message);
    }
  };

  return (
    <>
      <div style={{ 
        padding: '2rem', 
        maxWidth: '50%',
        width: '50%',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '40px 8px 40px 8px',
        minHeight: '45vh',
        display: 'grid',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
      <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>📥 Contribution Section</h1>
      <p style={{ color: '#222', marginBottom: '2rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
        Support the preservation and growth of The Moothedath Ancestral House through volunteering, donations, and feedback.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('volunteer')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'volunteer' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'volunteer' ? 'bold' : 'normal',
              position: 'relative', zIndex: 2,
              fontSize: '1.25rem'
          }}
        >
          Volunteer
        </button>
        <button 
          onClick={() => setActiveTab('donate')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'donate' ? '#007bff' : '#333',
            cursor: 'pointer',
              fontWeight: activeTab === 'donate' ? 'bold' : 'normal',
              fontSize: '1.25rem'
          }}
        >
          Donate
        </button>
        <button 
          onClick={() => setActiveTab('polls')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'polls' ? '#007bff' : '#333',
            cursor: 'pointer',
              fontWeight: activeTab === 'polls' ? 'bold' : 'normal',
              fontSize: '1.25rem'
          }}
        >
          Polls
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: 'transparent',
            color: activeTab === 'feedback' ? '#007bff' : '#333',
            cursor: 'pointer',
              fontWeight: activeTab === 'feedback' ? 'bold' : 'normal',
              fontSize: '1.25rem'
          }}
        >
          Feedback
        </button>
          <button 
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: activeTab === 'requests' ? '#007bff' : '#333',
              cursor: 'pointer',
              fontWeight: activeTab === 'requests' ? 'bold' : 'normal',
              fontSize: '1.25rem'
            }}
          >
            Requests
          </button>
      </div>

      {/* Volunteer Section */}
      {activeTab === 'volunteer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderRadius: '40px 8px 40px 8px', background: 'transparent' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>🤝 Volunteer Opportunities</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {volunteerOpportunities.map(opportunity => (
                <div key={opportunity.id} style={{ 
                  background: 'transparent', 
                  padding: '1.5rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#222', margin: 0 }}>{opportunity.title}</h3>
                    <span style={{ 
                      background: '#28a745', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 4,
                      fontSize: '0.8rem'
                    }}>
                      {opportunity.status}
                    </span>
                  </div>
                  <p style={{ 
                  color: '#28a745', 
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.98rem',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                }}>{opportunity.description}</p>
                                      <p style={{ 
                      color: '#28a745', 
                      fontSize: '0.9rem', 
                      margin: '0 0 0.5rem 0',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>
                      <strong>Time:</strong> {opportunity.timeCommitment}
                    </p>
                    <p style={{ 
                      color: '#28a745', 
                      fontSize: '0.9rem', 
                      margin: '0 0 0.5rem 0',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>
                      <strong>Location:</strong> {opportunity.location}
                    </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {opportunity.skills.map(skill => (
                      <span key={skill} style={{ 
                        background: '#f8f9fa', 
                        color: '#666', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 4,
                        fontSize: '0.8rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📝 Volunteer Signup</h2>
            <form onSubmit={handleVolunteerSubmit} style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input
                  id="volunteer-name"
                  name="name"
                  type="text"
                  required
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
                <input
                  id="volunteer-email"
                  name="email"
                  type="email"
                  required
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
                <input
                  id="volunteer-phone"
                  name="phone"
                  type="tel"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-opportunity" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Opportunity *</label>
                <select
                  id="volunteer-opportunity"
                  name="opportunity"
                  required
                  value={volunteerForm.opportunity}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, opportunity: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select an opportunity</option>
                  {volunteerOpportunities.map(opp => (
                    <option key={opp.id} value={opp.title}>{opp.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-availability" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Availability</label>
                <textarea
                  id="volunteer-availability"
                  name="availability"
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, availability: e.target.value }))}
                  placeholder="When are you available to volunteer?"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="volunteer-message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
                <textarea
                  id="volunteer-message"
                  name="message"
                  value={volunteerForm.message}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your skills and why you'd like to volunteer"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 100 }}
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
                Submit Volunteer Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Donation Section */}
      {activeTab === 'donate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderRadius: '40px 8px 40px 8px', background: 'transparent' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💝 Donation Projects</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {donationProjects.map(project => (
                <div key={project.id} style={{ 
                  background: 'transparent', 
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <img 
  src={project.image && project.image.trim() ? project.image : process.env.PUBLIC_URL + '/default.jpg'} 
  alt={project.title}
  style={{ width: '100%', height: 150, objectFit: 'cover' }}
/>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#222', margin: 0 }}>{project.title}</h3>
                      <span style={{ 
                        background: '#28a745', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 4,
                        fontSize: '0.8rem'
                      }}>
                        {project.status}
                      </span>
                    </div>
                    <p style={{ 
                  color: '#28a745', 
                  margin: '0 0 1rem 0',
                  fontSize: '0.98rem',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                }}>{project.description}</p>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>₹{project.raised.toLocaleString()} raised</span>
                          {project.target > 0 && (
                        <span>{calculatePercentage(project.raised, project.target)}%</span>
                          )}
                      </div>
                        {project.target > 0 && (
                      <div style={{ 
                        background: '#e9ecef', 
                        height: 8, 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          background: '#28a745', 
                          height: '100%', 
                          width: `${calculatePercentage(project.raised, project.target)}%` 
                        }}></div>
                      </div>
                        )}
                    </div>
                      {project.target > 0 && (
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                      Goal: ₹{project.target.toLocaleString()}
                    </p>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💳 Make a Donation</h2>
            {isLoggedIn ? (
            <form onSubmit={handleDonationSubmit} style={{ 
              background: 'transparent', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input
                  id="donation-name"
                  name="name"
                  type="text"
                  required
                  value={donationForm.name}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
                <input
                  id="donation-email"
                  name="email"
                  type="email"
                  required
                  value={donationForm.email}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-project" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project *</label>
                <select
                  id="donation-project"
                  name="project"
                  required
                  value={donationForm.project}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, project: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                >
                  <option value="">Select a project</option>
                  {donationProjects.map(project => (
                    <option key={project.id} value={project.title}>{project.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Amount (₹) *</label>
                <input
                  id="donation-amount"
                  name="amount"
                  type="number"
                  required
                  min="100"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-anonymous" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="donation-anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={donationForm.anonymous}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                  />
                  <span>Make this donation anonymous</span>
                </label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="donation-message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message (Optional)</label>
                <textarea
                  id="donation-message"
                  name="message"
                  value={donationForm.message}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Leave a message with your donation"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>
                <button
                  type="button"
                  onClick={handleDonationSubmit}
                  style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%'
                  }}
                >
                Donate Now
              </button>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(true)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      width: '100%',
                      marginTop: '1rem',
                      fontWeight: 400
                    }}
                  >
                    Request Donation
                  </button>
                )}
            </form>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.8)',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '2rem',
                textAlign: 'center',
                marginTop: '2rem'
              }}>
                <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>You must be logged in to make a donation.</h3>
                <button
                  onClick={() => window.location.href = '/login'}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Login to Donate
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Polls Section */}
      {activeTab === 'polls' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Active Polls</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {activePolls.map(poll => (
              <div key={poll.id} style={{ 
                background: 'transparent', 
                padding: '2rem', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#222', margin: '0 0 1rem 0' }}>{poll.question}</h3>
                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                  {poll.options.map(option => {
                    const percentage = Math.round((option.votes / poll.totalVotes) * 100);
                    const hasVoted = votedPolls[poll.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(poll.id, option.id)}
                        disabled={votedPolls[poll.id]}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          border: hasVoted ? '2px solid #007bff' : '1px solid #ddd',
                          borderRadius: 8,
                          background: hasVoted ? '#f8f9ff' : '#fff',
                          cursor: votedPolls[poll.id] ? 'default' : 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <span>{option.text}</span>
                        <span style={{ color: '#666' }}>
                          {option.votes} votes ({percentage}%)
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  <span>Total votes: {poll.totalVotes}</span>
                  <span>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {activeTab === 'feedback' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💬 Feedback & Suggestions</h2>
          <form onSubmit={handleFeedbackSubmit} style={{ 
            background: 'transparent', 
            padding: '2rem', 
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="feedback-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
              <input
                id="feedback-name"
                name="name"
                type="text"
                required
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="feedback-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
              <input
                id="feedback-email"
                name="email"
                type="email"
                required
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="feedback-category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category *</label>
              <select
                id="feedback-category"
                name="category"
                required
                value={feedbackForm.category}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              >
                <option value="">Select a category</option>
                <option value="Website">Website Feedback</option>
                <option value="Events">Events & Activities</option>
                <option value="House">House & Maintenance</option>
                <option value="General">General Suggestions</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="feedback-message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message *</label>
              <textarea
                id="feedback-message"
                name="message"
                required
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Share your feedback, suggestions, or ideas..."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 120 }}
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
              Submit Feedback
            </button>
          </form>
        </div>
      )}
      
        {/* Requests Section */}
        {activeTab === 'requests' && (
          <div style={{ maxWidth: 800, margin: '2rem auto', background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: '#007bff', marginBottom: 24 }}>Donation Requests</h2>
            {(!loadingRequests && requests.length > 0) && (
              <div style={{ background: '#e9f5ff', color: '#007bff', borderRadius: 8, marginBottom: 24, padding: '1.5rem', fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,123,255,0.08)' }}>
                There {requests.length === 1 ? 'is' : 'are'} <b>{requests.length}</b> active donation request{requests.length === 1 ? '' : 's'}. Please review the details below and consider supporting or recommending them.
              </div>
            )}
            {loadingRequests ? <p>Loading...</p> : (
              requests.length === 0 ? <p>No requests yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {requests.map(req => {
                    const recommended = req.recommendedBy?.length || 0;
                    const notRecommended = req.notRecommendedBy?.length || 0;
                    const totalVotes = recommended + notRecommended;
                    const userEmail = currentUser?.email;
                    const hasRecommended = req.recommendedBy?.includes(userEmail);
                    const hasNotRecommended = req.notRecommendedBy?.includes(userEmail);
                    const recommendedPercent = totalVotes > 0 ? Math.round((recommended / totalVotes) * 100) : 0;
                    const notRecommendedPercent = totalVotes > 0 ? Math.round((notRecommended / totalVotes) * 100) : 0;
                    return (
                      <div key={req.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                          {req.photo && req.photo.trim() ? (
                            <img src={req.photo} alt={req.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }} />
                          ) : (
                            <img src="default.jpg" alt={req.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }} />
                          )}
                          <div>
                            <h3 style={{ margin: 0, color: '#007bff' }}>{req.name}</h3>
                            <p style={{ margin: 0, color: '#333', fontWeight: 500 }}>Purpose: <b>{req.purpose}</b></p>
                            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Requested Amount: <b>₹{req.amount}</b></p>
                            <p style={{ margin: 0, color: '#666', fontSize: 13 }}>Closing: {req.closingDate} | Remarks: {req.remarks}</p>
                          </div>
                        </div>
                        {/* Progress Bar for Recommended/Not Recommended */}
                        <div style={{ margin: '12px 0 16px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                            <span style={{ color: '#28a745', fontWeight: 600 }}>👍 {recommended} Recommended</span>
                            <span style={{ color: '#dc3545', fontWeight: 600 }}>👎 {notRecommended} Not Recommended</span>
                          </div>
                          <div style={{ background: '#e9ecef', height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                            <div style={{ background: '#28a745', width: `${recommendedPercent}%`, height: '100%' }}></div>
                            <div style={{ background: '#dc3545', width: `${notRecommendedPercent}%`, height: '100%' }}></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <button
                            disabled={hasRecommended}
                            onClick={async () => {
                              await updateDoc(doc(db, 'donationRequests', req.id), {
                                recommendedBy: arrayUnion(userEmail),
                                notRecommendedBy: arrayRemove(userEmail)
                              });
                              setRequests(r => r.map(x => x.id === req.id ? { ...x, recommendedBy: [...(x.recommendedBy||[]), userEmail], notRecommendedBy: (x.notRecommendedBy||[]).filter(e => e !== userEmail) } : x));
                            }}
                            style={{ background: hasRecommended ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', cursor: hasRecommended ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                          >
                            👍 Recommend ({recommended})
                          </button>
                          <button
                            disabled={hasNotRecommended}
                            onClick={async () => {
                              await updateDoc(doc(db, 'donationRequests', req.id), {
                                notRecommendedBy: arrayUnion(userEmail),
                                recommendedBy: arrayRemove(userEmail)
                              });
                              setRequests(r => r.map(x => x.id === req.id ? { ...x, notRecommendedBy: [...(x.notRecommendedBy||[]), userEmail], recommendedBy: (x.recommendedBy||[]).filter(e => e !== userEmail) } : x));
                            }}
                            style={{ background: hasNotRecommended ? '#dc3545' : '#6c757d', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', cursor: hasNotRecommended ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                          >
                            👎 Not Recommend ({notRecommended})
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
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
      {showRequestModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <form onSubmit={handleRequestSubmit} style={{background: 'rgba(0,123,255,0.97)', color: 'white', padding: 32, borderRadius: 16, minWidth: 350, maxWidth: 420, width: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'}}>
            <h2 style={{marginTop: 0, color: 'white'}}>Request a Donation</h2>
            <label htmlFor="request-name">Name</label>
            <input id="request-name" name="name" type='text' value={requestForm.name} onChange={e=>setRequestForm(f=>({...f, name:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-email">Email</label>
            <input id="request-email" name="email" type='email' value={requestForm.email} onChange={e=>setRequestForm(f=>({...f, email:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-photo">Photo (URL, optional)</label>
            <input id="request-photo" name="photo" type='text' value={requestForm.photo} onChange={e=>setRequestForm(f=>({...f, photo:e.target.value}))} style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-mobile">Mobile Number</label>
            <input id="request-mobile" name="mobile" type='text' value={requestForm.mobile} onChange={e=>setRequestForm(f=>({...f, mobile:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-amount">Required Amount (₹)</label>
            <input id="request-amount" name="amount" type='number' value={requestForm.amount} onChange={e=>setRequestForm(f=>({...f, amount:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-purpose">Purpose of the Amount</label>
            <textarea id="request-purpose" name="purpose" value={requestForm.purpose} onChange={e=>setRequestForm(f=>({...f, purpose:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-closingDate">Donation Closing Date</label>
            <input id="request-closingDate" name="closingDate" type='date' value={requestForm.closingDate} min={new Date().toISOString().split('T')[0]} onChange={e=>setRequestForm(f=>({...f, closingDate:e.target.value}))} required style={{width:'100%',marginBottom:8}}/>
            <label htmlFor="request-remarks">Remarks (optional)</label>
            <textarea id="request-remarks" name="remarks" value={requestForm.remarks} onChange={e=>setRequestForm(f=>({...f, remarks:e.target.value}))} style={{width:'100%',marginBottom:8}}/>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
              <button type='button' onClick={()=>setShowRequestModal(false)} style={{background:'#ccc',border:'none',borderRadius:6,padding:'0.5rem 1rem'}}>Cancel</button>
              <button type='submit' style={{background:'#28a745',color:'white',border:'none',borderRadius:6,padding:'0.5rem 1rem'}}>Submit</button>
            </div>
          </form>
    </div>
      )}
      {requestSuccess && (
        <div style={{position:'fixed',top:20,right:20,background:'#28a745',color:'white',padding:'1rem 2rem',borderRadius:8,zIndex:2000}}>Request submitted successfully!</div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 12,
            textAlign: 'center',
            maxWidth: 400,
            width: '90%'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>📱 UPI Payment QR Code</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
            </p>
            <div style={{ 
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: 8,
              marginBottom: '1.5rem',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ color: '#007bff', marginBottom: '1rem' }}>Quick Payment</h4>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Simply scan the QR code below with your preferred UPI app
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '1rem',
                background: '#fff',
                borderRadius: 8,
                border: '2px solid #007bff'
              }}>
                <img 
                  src={qrCodeDataUrl} 
                  alt="Payment QR Code" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto'
                  }} 
                />
              </div>
              <p style={{ color: '#28a745', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                ✅ Valid UPI QR Code - Ready to scan!
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#007bff', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                Amount: ₹{donationForm.amount}
              </p>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                Project: {donationForm.project}
              </p>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                <strong>Payment Details:</strong>
              </p>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                💳 UPI ID: rajeshkumar757575@okicici<br />
                📱 Mobile: +91-9789655564<br />
                💬 WhatsApp: +91-7904926096<br />
                🏦 Bank: ICICI Bank<br />
                📧 Email: family.moothedathhouse@gmail.com
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowQRCode(false)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Contribute; 