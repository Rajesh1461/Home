import React, { useState } from 'react';

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
    title: 'Temple Renovation Fund',
    description: 'Help restore and modernize our family temple while preserving its traditional architecture',
    target: 50000,
    raised: 32000,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Kitchen Modernization',
    description: 'Update kitchen facilities while maintaining traditional cooking methods',
    target: 25000,
    raised: 18000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Documentation Project',
    description: 'Digitize family photos, documents, and preserve family history',
    target: 10000,
    raised: 7500,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    status: 'Active'
  }
];

function Contribute() {
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
    alert('Thank you for your generous contribution! Your donation will help preserve our family heritage.');
    setDonationForm({
      name: '',
      email: '',
      amount: '',
      project: '',
      anonymous: false,
      message: ''
    });
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

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>📥 Contribution Section</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
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
            background: activeTab === 'volunteer' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'volunteer' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'volunteer' ? 'bold' : 'normal'
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
            background: activeTab === 'donate' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'donate' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'donate' ? 'bold' : 'normal'
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
            background: activeTab === 'polls' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'polls' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'polls' ? 'bold' : 'normal'
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
            background: activeTab === 'feedback' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'feedback' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'feedback' ? 'bold' : 'normal'
          }}
        >
          Feedback
        </button>
      </div>

      {/* Volunteer Section */}
      {activeTab === 'volunteer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>🤝 Volunteer Opportunities</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {volunteerOpportunities.map(opportunity => (
                <div key={opportunity.id} style={{ 
                  background: '#fff', 
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
                  <p style={{ color: '#555', margin: '0 0 0.5rem 0' }}>{opportunity.description}</p>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                    <strong>Time:</strong> {opportunity.timeCommitment}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
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
              background: '#fff', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
                <input
                  type="tel"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Opportunity *</label>
                <select
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Availability</label>
                <textarea
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, availability: e.target.value }))}
                  placeholder="When are you available to volunteer?"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
                <textarea
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💝 Donation Projects</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {donationProjects.map(project => (
                <div key={project.id} style={{ 
                  background: '#fff', 
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={project.image} 
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
                    <p style={{ color: '#555', margin: '0 0 1rem 0' }}>{project.description}</p>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>₹{project.raised.toLocaleString()} raised</span>
                        <span>{calculatePercentage(project.raised, project.target)}%</span>
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
                          width: `${calculatePercentage(project.raised, project.target)}%` 
                        }}></div>
                      </div>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                      Goal: ₹{project.target.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>💳 Make a Donation</h2>
            <form onSubmit={handleDonationSubmit} style={{ 
              background: '#fff', 
              padding: '2rem', 
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={donationForm.name}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={donationForm.email}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project *</label>
                <select
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={donationForm.anonymous}
                    onChange={(e) => setDonationForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                  />
                  <span>Make this donation anonymous</span>
                </label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message (Optional)</label>
                <textarea
                  value={donationForm.message}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Leave a message with your donation"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, height: 80 }}
                />
              </div>
              <button type="submit" style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%'
              }}>
                Donate Now
              </button>
            </form>
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
                background: '#fff', 
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
            background: '#fff', 
            padding: '2rem', 
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
              <input
                type="text"
                required
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
              <input
                type="email"
                required
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category *</label>
              <select
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message *</label>
              <textarea
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
    </div>
  );
}

export default Contribute; 