import React from 'react';

const style = {
  position: 'absolute',
  top: '0',
  left: '0',
  margin: '1rem',
}

export const HomeLink = () => (
  <button className='home-link' style={style}>
    <a href="/"
      style={{ 
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        padding: '6px 12px'
      }}>
      Home
    </a>
  </button>
)