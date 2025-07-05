import React from 'react';

function RainbowTest() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>🌈 Rainbow Animation Test</h1>
      
      <div style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test 1: Basic Rainbow Text</h2>
        <p style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          animation: 'rainbow 3s linear infinite',
          margin: '1rem 0'
        }}>
          This text should change colors!
        </p>
      </div>
      
      <div style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test 2: Developer Text Style</h2>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,0,0,0.3)',
          padding: '1rem 2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.2)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <p style={{ 
            fontSize: '1.5rem', 
            margin: 0,
            fontWeight: 'bold',
            animation: 'rainbow 4s linear infinite',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Developed by Rajesh Kumar Menon Moothedath
          </p>
        </div>
      </div>
      
      <div style={{ margin: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test 3: Simple Color Change</h2>
        <p style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          animation: 'simpleRainbow 2s linear infinite',
          margin: '1rem 0'
        }}>
          Simple rainbow effect
        </p>
      </div>
      
      <style>
        {`
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
          
          @keyframes simpleRainbow {
            0% { color: red; }
            16% { color: orange; }
            32% { color: yellow; }
            48% { color: green; }
            64% { color: blue; }
            80% { color: indigo; }
            96% { color: violet; }
            100% { color: red; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default RainbowTest; 