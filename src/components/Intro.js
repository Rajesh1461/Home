import React from 'react';

function Intro() {
  return (
    <div style={{ 
      background: 'black', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>🎉 Intro Page Working!</h1>
        <p>This confirms routing is working correctly</p>
        <button 
          onClick={() => window.location.href = '/home'}
          style={{
            padding: '10px 20px',
            fontSize: '20px',
            background: 'pink',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default Intro; 