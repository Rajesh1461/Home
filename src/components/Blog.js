import React, { useState } from 'react';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Grandmother\'s Kitchen Secrets',
    author: 'Grandmother Lakshmi',
    date: '2024-12-15',
    category: 'Cooking Traditions',
    tags: ['recipes', 'traditional', 'kitchen', 'family'],
    excerpt: 'The secrets of our family\'s traditional cooking methods that have been passed down through generations...',
    content: `The kitchen in our ancestral house has always been the heart of our family. Every morning, the aroma of freshly ground spices fills the air, and the sound of the traditional stone grinder echoes through the house.

My grandmother taught me that cooking is not just about following recipes - it's about love, patience, and understanding the ingredients. She would say, "The rice knows when you're cooking with love, and the curry tastes different when you're in a hurry."

Our traditional recipes have been preserved for over a century. The secret to our family's famous fish curry lies not just in the spices, but in the way we prepare them. Each spice is roasted separately, ground fresh, and added at the perfect moment.

The kitchen also serves as our family's gathering place. While cooking, we share stories, solve family problems, and plan celebrations. It's where the elders pass down wisdom and the young ones learn about our culture.

I remember my grandmother saying, "This kitchen has seen more family discussions than any other room in the house." And she was right. From wedding preparations to festival cooking, every important family event has been planned and celebrated in this sacred space.`,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    readTime: '5 min read',
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    title: 'The Story of Our Temple',
    author: 'Grandfather Rajan',
    date: '2024-11-20',
    category: 'Family History',
    tags: ['temple', 'spiritual', 'history', 'traditions'],
    excerpt: 'How our family temple came to be and the spiritual significance it holds for our family...',
    content: `Our family temple was not built overnight. It was a dream that my father carried in his heart for many years. In 1980, after years of saving and planning, we finally began construction.

The temple was designed following traditional Kerala temple architecture. Every detail, from the stone carvings to the wooden pillars, was chosen with care. My father would spend hours supervising the construction, ensuring that every element was perfect.

The consecration ceremony was a grand affair that brought together our entire family and the local community. It was a day filled with prayers, traditional music, and the blessings of our ancestors.

Today, the temple serves as the spiritual center of our family. Every morning, we gather here for prayers, and every evening, the sound of temple bells fills the air. It's a place where we find peace, seek guidance, and connect with our spiritual roots.

The temple has witnessed many important moments in our family's history - from daily prayers to special ceremonies, from family gatherings to individual moments of reflection. It's more than just a place of worship; it's a living part of our family's story.`,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    readTime: '7 min read',
    likes: 31,
    comments: 12
  },
  {
    id: 3,
    title: 'Renovation Diary: Preserving the Past',
    author: 'Father Mohan',
    date: '2024-10-10',
    category: 'Renovation Diaries',
    tags: ['renovation', 'preservation', 'architecture', 'heritage'],
    excerpt: 'Our journey to restore and preserve the ancestral house while maintaining its traditional charm...',
    content: `When we decided to renovate our ancestral house, we faced a unique challenge: how to modernize while preserving the traditional character that makes this house special.

The renovation project began in 2020 and took nearly two years to complete. We worked with architects who specialized in heritage conservation to ensure that every change respected the original design.

One of the biggest challenges was the electrical system. The old wiring needed to be completely replaced, but we wanted to maintain the traditional look. We found a solution by hiding modern wiring behind traditional wooden panels.

The roof was another major concern. The original clay tiles were beautiful but had started to leak. Instead of replacing them with modern materials, we sourced traditional tiles from the same region and restored the original pattern.

Throughout the renovation, we discovered many hidden treasures - original carvings that had been painted over, traditional storage spaces that had been forgotten, and architectural details that told the story of our house's evolution.

The most rewarding part was seeing the house come back to life. Every room now has modern amenities while maintaining its traditional character. The house is ready to serve our family for another century.`,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    readTime: '8 min read',
    likes: 45,
    comments: 15
  },
  {
    id: 4,
    title: 'Local Culture: Festivals and Traditions',
    author: 'Aunt Meera',
    date: '2024-09-15',
    category: 'Local Culture',
    tags: ['festivals', 'traditions', 'culture', 'community'],
    excerpt: 'How our family celebrates local festivals and preserves cultural traditions...',
    content: `Our ancestral house has always been a center for cultural celebrations. Every festival is an opportunity to bring the family together and pass down traditions to the next generation.

Pongal is one of our most important celebrations. The entire family gathers in the kitchen to prepare the traditional Pongal dish. The children learn the significance of each ingredient and the proper way to cook it. It's not just about the food; it's about gratitude for nature's bounty.

During Onam, our house transforms into a celebration of Kerala's culture. We create traditional flower arrangements, prepare the grand Onam feast, and wear traditional attire. The children participate in cultural programs, learning traditional songs and dances.

The temple festivals are another highlight. Our family temple becomes the center of community celebrations, with people from surrounding areas joining us for prayers and cultural programs.

These celebrations are not just about tradition; they're about strengthening family bonds and creating memories that last a lifetime. Every festival brings new stories, new experiences, and new connections with our cultural roots.

I believe that preserving these traditions is essential for maintaining our family's identity and passing on our cultural heritage to future generations.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    readTime: '6 min read',
    likes: 28,
    comments: 9
  },
  {
    id: 5,
    title: 'Stories from My Childhood',
    author: 'Uncle Suresh',
    date: '2024-08-20',
    category: 'Family Stories',
    tags: ['childhood', 'memories', 'family', 'nostalgia'],
    excerpt: 'Memories of growing up in the ancestral house and the lessons learned from family elders...',
    content: `Growing up in this ancestral house was a magical experience. Every corner of the house has a story, every room holds memories of family gatherings and celebrations.

The thinnai (front porch) was my favorite place as a child. It's where I would sit with my grandfather and listen to stories about our family's history. He would tell me about the people who built this house, the challenges they faced, and the values they lived by.

The kitchen was another special place. My grandmother would let me help with simple tasks like grinding spices or washing rice. She would tell me that cooking is a form of meditation, a way to show love to your family.

The courtyard was our playground. We would play traditional games, learn about plants and trees, and spend hours exploring every nook and cranny. The elders would supervise our play, teaching us about respect for nature and family traditions.

The most important lesson I learned was about family unity. In this house, everyone had a role to play, from the youngest child to the oldest elder. We learned to work together, support each other, and celebrate our differences.

Today, as I watch my own children grow up in the same house, I realize how fortunate we are to have this connection to our past. The house is not just a building; it's a living testament to our family's values and traditions.`,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    readTime: '9 min read',
    likes: 52,
    comments: 18
  }
];

const categories = ['All', 'Cooking Traditions', 'Family History', 'Renovation Diaries', 'Local Culture', 'Family Stories'];

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.5)', borderRadius: '40px 8px 40px 8px', minHeight: '45vh' }}>
        <h1 style={{ position: 'relative', zIndex: 10, color: '#222', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>📜 Blog / Family Journal</h1>
        <p style={{ color: '#222', marginBottom: '2rem', position: 'relative', zIndex: 10, fontWeight: 'bold', textShadow: '0 2px 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.15)' }}>
          Stories from elders, renovation diaries, cooking traditions, and local culture - preserving our family's heritage through words.
        </p>

        {/* Search and Filter */}
        <div style={{ 
          background: 'transparent', 
          padding: '1.5rem', 
          borderRadius: 12, 
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search stories, recipes, traditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: '1rem',
              minWidth: 150
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Blog Posts Grid */}
        {!selectedPost && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {filteredPosts.map(post => (
              <div key={post.id} style={{ 
                background: 'transparent', 
                borderRadius: 12, 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedPost(post)}
              >
                <div style={{ display: 'flex' }}>
                  <img 
                    src={post.image && post.image.trim() ? post.image : 'default.jpg'} 
                    alt={post.title}
                    style={{ width: 200, height: 200, objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        background: '#007bff', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 20,
                        fontSize: '0.8rem'
                      }}>
                        {post.category}
                      </span>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>{post.readTime}</span>
                    </div>
                    <h3 style={{ position: 'relative', zIndex: 2, color: '#222', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>{post.title}</h3>
                    <p style={{ 
                      position: 'relative', 
                      zIndex: 2, 
                      color: '#28a745', 
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.98rem',
                      textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                    }}>By {post.author} • {formatDate(post.date)}</p>
                    <p style={{ 
                  position: 'relative', 
                  zIndex: 2, 
                  color: '#28a745', 
                  lineHeight: 1.5, 
                  margin: '0 0 1rem 0',
                  fontSize: '0.98rem',
                  textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px -0.5px 1px rgba(0,0,0,0.8), -0.5px 0.5px 1px rgba(0,0,0,0.8)'
                }}>{post.excerpt}</p>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{ 
                          background: '#f8f9fa', 
                          color: '#666', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 4,
                          fontSize: '0.8rem'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single Post View */}
        {selectedPost && (
          <div style={{ background: 'transparent', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button 
              onClick={() => setSelectedPost(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ← Back to all posts
            </button>
            
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: 20,
                fontSize: '0.9rem'
              }}>
                {selectedPost.category}
              </span>
            </div>
            
            <h1 style={{ position: 'relative', zIndex: 2, color: '#222', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{selectedPost.title}</h1>
            <p style={{ position: 'relative', zIndex: 2, color: '#666', margin: '0 0 1rem 0' }}>
              By {selectedPost.author} • {formatDate(selectedPost.date)} • {selectedPost.readTime}
            </p>
            
            <img 
              src={selectedPost?.image && selectedPost?.image.trim() ? selectedPost.image : 'default.jpg'} 
              alt={selectedPost.title}
              style={{ 
                width: '100%', 
                maxWidth: 600, 
                height: 300, 
                objectFit: 'cover', 
                borderRadius: 8,
                marginBottom: '1.5rem'
              }}
            />
            
            <div style={{ 
              position: 'relative', zIndex: 2,
              lineHeight: 1.8, 
              color: '#333', 
              fontSize: '1.1rem',
              whiteSpace: 'pre-line'
            }}>
              {selectedPost.content}
            </div>
            
            <div style={{ 
              position: 'relative', zIndex: 2,
              marginTop: '2rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1rem' }}>
                <button style={{
                  background: '#f8f9fa',
                  border: '1px solid #ddd',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}>
                  ❤️ Like ({selectedPost.likes})
                </button>
                <button style={{
                  background: '#f8f9fa',
                  border: '1px solid #ddd',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}>
                  💬 Comment ({selectedPost.comments})
                </button>
              </div>
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
                {selectedPost.tags.map(tag => (
                  <span key={tag} style={{ 
                    background: '#f8f9fa', 
                    color: '#666', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 4,
                    fontSize: '0.8rem'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredPosts.length === 0 && !selectedPost && (
          <div style={{ 
            position: 'relative', zIndex: 2,
            textAlign: 'center', 
            padding: '3rem', 
            color: '#666',
            background: 'transparent',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3>No stories found</h3>
            <p>Try adjusting your search terms or category filter.</p>
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

export default Blog; 