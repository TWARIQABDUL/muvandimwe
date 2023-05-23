import React, { useEffect, useState } from 'react';
import NavContent from './navcontent';

function NavBar() {
  const [isNav, showNav] = useState(false);
  const leafMap = document.getElementsByClassName("leaflet-container")
  const taggleNav = () => {
    showNav(!isNav);
    
  };
  return (
    <div className='nav'>
      <h1 className='text'>App Logo</h1>
      <div id='taggle' onClick={taggleNav}>
        <p></p>
      </div>
      {isNav && <NavContent />}
    </div>
  );
}

export default NavBar;
