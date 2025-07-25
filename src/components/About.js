import React, { useState } from 'react';

// Sample family tree data
const familyTree = {
  name: 'Moothedath Family',
  children: [
    {
      name: 'Generation 1',
      children: [
        {
          name: 'Great Grandfather',
          birthYear: '1890',
          deathYear: '1975',
          description: 'Built the ancestral house in 1920',
          children: [
            {
              name: 'Grandfather',
              birthYear: '1925',
              deathYear: '2000',
              description: 'Expanded the house in 1950',
              children: [
                {
                  name: 'Father',
                  birthYear: '1955',
                  description: 'Current caretaker',
                  children: [
                    { name: 'You', birthYear: '1985', description: 'Next generation' },
                    { name: 'Sibling', birthYear: '1988', description: 'Family member' }
                  ]
                },
                {
                  name: 'Uncle',
                  birthYear: '1958',
                  description: 'Lives in the city',
                  children: [
                    { name: 'Cousin 1', birthYear: '1987', description: 'Family member' },
                    { name: 'Cousin 2', birthYear: '1990', description: 'Family member' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Sample timeline data
const timeline = [
  {
    year: '1980',
    title: 'Temple Addition',
    description: 'Built the family temple in the courtyard, becoming the spiritual center of the house.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'
  },
  {
    year: '2015',
    title: 'Modern Renovation',
    description: 'Updated electrical systems and added modern amenities while preserving traditional architecture.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
  },
  {
    year: '2020',
    title: 'Heritage Restoration',
    description: 'Comprehensive restoration project to preserve the house for future generations.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  },
  {
    year: '2025',
    title: 'Centenary Celebration',
    description: 'Celebrating 100 years of the ancestral house with a grand family reunion and cultural events.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
  }
];

// Sample architectural sections
const architecturalSections = [
  {
    name: 'Thinnai (Front Porch)',
    description: 'Traditional front porch where family members gather for evening conversations and welcome guests.',
    features: ['Traditional wooden pillars', 'Clay tile roof', 'Built-in seating', 'Decorative carvings'],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    yearBuilt: '1920'
  },
  {
    name: 'Veranda',
    description: 'Extended veranda added in 1950, serves as a multipurpose space for family activities and celebrations.',
    features: ['Open-air design', 'Traditional flooring', 'Ceiling fans', 'Family gathering space'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    yearBuilt: '1950'
  },
  {
    name: 'Kitchen',
    description: 'Traditional kitchen with modern amenities, where family recipes have been passed down for generations.',
    features: ['Wood-burning stove', 'Modern appliances', 'Traditional storage', 'Family dining area'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    yearBuilt: '1920'
  },
  {
    name: 'Prayer Room',
    description: 'Sacred space for daily prayers and spiritual activities, decorated with traditional motifs.',
    features: ['Sacred altar', 'Traditional lamps', 'Prayer mats', 'Religious artifacts'],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    yearBuilt: '1920'
  },
  {
    name: 'Temple',
    description: 'Family temple built in 1980, serving as the spiritual center for religious ceremonies and festivals.',
    features: ['Traditional architecture', 'Sacred idols', 'Bell tower', 'Courtyard space'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    yearBuilt: '1980'
  },
  {
    name: 'Granary',
    description: 'Traditional storage area for grains and agricultural produce, built with natural cooling systems.',
    features: ['Natural ventilation', 'Traditional storage bins', 'Cooling system', 'Agricultural tools'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    yearBuilt: '1920'
  }
];

// Sample renovation stories
const renovationStories = [
  {
    title: 'The Great Kitchen Renovation of 2005',
    author: 'Grandmother',
    date: '2005',
    story: 'When we decided to modernize the kitchen, we faced a challenge: how to preserve the traditional charm while adding modern conveniences. We kept the original wood-burning stove as a centerpiece and added modern appliances around it. The result was perfect - we could cook traditional recipes while enjoying modern efficiency.',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400']
  },
  {
    title: 'Restoring the Temple Courtyard',
    author: 'Father',
    date: '2020',
    story: 'The temple courtyard had fallen into disrepair over the years. During the 2020 restoration, we discovered original stone carvings that had been hidden under layers of paint. The restoration team carefully preserved these ancient designs while strengthening the structure for future generations.',
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400']
  },
  {
    title: 'The Thinnai Restoration',
    author: 'Uncle',
    date: '2018',
    story: 'The front porch (thinnai) is where our family has gathered for generations. When we restored it, we found that the wooden pillars were still strong despite being 100 years old. We replaced only the damaged parts and preserved the original design, ensuring that future generations can enjoy the same traditional gathering space.',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400']
  }
];

function FamilyTreeNode({ node, level = 0 }) {
  const [expanded, setExpanded] = useState(level < 2);
  
  return (
    <div style={{ marginLeft: level * 20 }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '0.5rem',
          background: level === 0 ? '#f8f9fa' : '#fff',
          borderRadius: 8,
          marginBottom: '0.5rem',
          border: '1px solid #e9ecef'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ marginRight: '0.5rem' }}>
          {node.children && (expanded ? '▼' : '▶')}
        </span>
        <div>
          <div style={{ fontWeight: 'bold' }}>{node.name}</div>
          {node.birthYear && (
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {node.birthYear} - {node.deathYear || 'Present'}
            </div>
          )}
          {node.description && (
            <div style={{ 
            fontSize: '0.8rem', 
            color: '#28a745',
            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
          }}>{node.description}</div>
          )}
        </div>
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FamilyTreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function About() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', minHeight: 'calc(100vh - 120px)', height: 'auto' }}>
      <h1 style={{ position: 'relative', zIndex: 2, color: '#222', fontSize: '2.2rem', marginBottom: '1.5rem' }}>🧾 About The Moothedath Ancestral House</h1>
      <p style={{ 
        color: '#28a745', 
        fontSize: '1.15rem', 
        marginBottom: '2.5rem', 
        position: 'relative', 
        zIndex: 2,
        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
      }}>
        Discover the rich history, architectural beauty, and family stories that make our ancestral house a living heritage.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('history')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'history' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'history' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal',
            position: 'relative', zIndex: 2
          }}
        >
          History Timeline
        </button>
        <button 
          onClick={() => setActiveTab('family')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'family' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'family' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'family' ? 'bold' : 'normal'
          }}
        >
          Family Tree
        </button>
        <button 
          onClick={() => setActiveTab('architecture')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'architecture' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'architecture' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'architecture' ? 'bold' : 'normal'
          }}
        >
          Architecture
        </button>
        <button 
          onClick={() => setActiveTab('renovations')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'renovations' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'renovations' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: activeTab === 'renovations' ? 'bold' : 'normal'
          }}
        >
          Renovation Stories
        </button>
      </div>

      {/* History Timeline */}
      {activeTab === 'history' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '2.1rem', marginBottom: '1rem' }}>📜 History Timeline</h2>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {timeline.map((event, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'flex-start',
                position: 'relative'
              }}>
                <div style={{ 
                  width: 100, 
                  textAlign: 'center',
                  marginRight: '2rem'
                }}>
                  <div style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '0.5rem', 
                    borderRadius: 8,
                    fontWeight: 'bold'
                  }}>
                    {event.year}
                  </div>
                </div>
                <div style={{ 
                  flex: 'none',
                  width: 300,
                  background: '#fff', 
                  padding: '1.5rem', 
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: -10, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    width: 0, 
                    height: 0, 
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderRight: '10px solid #fff'
                  }}></div>
                  <h3 style={{ color: '#222', margin: '0 0 0.5rem 0', textAlign: 'center' }}>{event.title}</h3>
                  <p style={{ 
                    color: '#28a745', 
                    margin: '0 0 1rem 0', 
                    textAlign: 'center',
                    fontSize: '0.98rem',
                    textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                  }}>{event.description}</p>
                  <img 
                      src={event.image && event.image.trim() ? event.image : process.env.PUBLIC_URL + '/default.jpg'} 
                    alt={event.title}
                    style={{ 
                      width: '100%', 
                      maxWidth: 300, 
                      height: 200, 
                      objectFit: 'cover', 
                      borderRadius: 8 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Family Tree */}
      {activeTab === 'family' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '2.1rem', marginBottom: '1rem', textAlign: 'center' }}>🌳 Family Tree</h2>
          <div style={{ textAlign: 'center' }}>
            <img src="/Family%20Tree.jpg" alt="Family Tree" style={{ maxWidth: '100%', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      )}

      {/* Architecture */}
      {activeTab === 'architecture' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '2.1rem', marginBottom: '1rem' }}>🏛️ Architectural Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {architecturalSections.map((section, index) => (
              <div key={index} style={{ 
                background: '#fff', 
                borderRadius: 12, 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img 
                    src={section.image && section.image.trim() ? section.image : process.env.PUBLIC_URL + '/default.jpg'} 
                  alt={section.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#222', margin: 0 }}>{section.name}</h3>
                    <span style={{ 
                      background: '#007bff', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 4,
                      fontSize: '0.8rem'
                    }}>
                      {section.yearBuilt}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#28a745', 
                    margin: '0 0 1rem 0',
                    fontSize: '0.98rem',
                    textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                  }}>{section.description}</p>
                  <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>Key Features:</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{ color: '#666', marginBottom: '0.25rem' }}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renovation Stories */}
      {activeTab === 'renovations' && (
        <div>
          <h2 style={{ color: '#333', fontSize: '2.1rem', marginBottom: '1rem' }}>🔨 Renovation Stories</h2>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {renovationStories.map((story, index) => (
              <div key={index} style={{ 
                background: '#fff', 
                borderRadius: 12, 
                padding: '2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#222', margin: 0 }}>{story.title}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>By {story.author}</div>
                    <div style={{ color: '#007bff', fontWeight: 'bold' }}>{story.date}</div>
                  </div>
                </div>
                <p style={{ 
                  color: '#28a745', 
                  lineHeight: 1.6, 
                  marginBottom: '1rem',
                  fontSize: '0.98rem',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                }}>{story.story}</p>
                {story.images && (
                  <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                    {story.images.map((image, imageIndex) => (
                      <img 
                        key={imageIndex}
                          src={image && image.trim() ? image : process.env.PUBLIC_URL + '/default.jpg'} 
                        alt={story.title}
                        style={{ 
                          width: 200, 
                          height: 150, 
                          objectFit: 'cover', 
                          borderRadius: 8,
                          cursor: 'pointer'
                        }}
                      />
                    ))}
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
    </>
  );
}

export default About; 