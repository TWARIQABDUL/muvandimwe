import { Geolocation } from '@capacitor/geolocation';
import React, { useState } from 'react';

function Testreq() {
  const [granted, setGranted] = useState(false);
  const [grantedmsg, setGrantedmsg] = useState('');

  const requestLocationPermission = async () => {
    try {
      const { state } = await Geolocation.requestPermissions();
      if (state === 'granted') {
        setGranted(true);
        setGrantedmsg('Permission granted');
      } else {
        setGranted(false);
        setGrantedmsg('Permission not granted',state);
      }
    } catch (error) {
      setGranted(false);
      setGrantedmsg('Permission problem');
    }
  };

  return (
    <div>
      {grantedmsg ? <>{grantedmsg}</> : <>Failed {grantedmsg}</>}
      <button onClick={requestLocationPermission}>Request</button>
    </div>
  );
}

export default Testreq;
