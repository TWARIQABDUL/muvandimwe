import React, { useEffect, useState } from 'react';
import LetterAvatar from 'react-letter-avatar';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

function Driver({ lists }) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const permissionStatus = await Geolocation.checkPermissions();
        const hasPermission = permissionStatus.location === 'granted';
        if (hasPermission) {
          const { coords } = await Geolocation.getCurrentPosition();
          setPosition({ lat: coords.latitude, lng: coords.longitude });
        }
      } catch (error) {
        setPosition(null);
      }
    };

    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (position) {
      const myCurrentPossition = [position.lat, position.lng];
      const driverLocation = [lists.location._lat, lists.location._long];
      const myPosition = L.latLng(myCurrentPossition[0], myCurrentPossition[1]);
      const driverPosition = L.latLng(driverLocation[0], driverLocation[1]);
      const distanceInMeters = myPosition.distanceTo(driverPosition);
      const distanceInKilometers = distanceInMeters / 1000;
      setDistance(distanceInKilometers.toFixed(2));
    }
  }, [position]);

  function extractLetter(string) {
    return string.charAt(0).toUpperCase();
  }
// console.log(lists);
  const letel = extractLetter(lists.name);
  return (
    <div className="driver-holder">
      <Link to="jack" className="link-black">
        <div className="driver-profile">
          <LetterAvatar name={letel} size={50} radius={50} />
          {lists.name}
        </div>
        <div className="driver-info">
          {distance ? <p>{distance} Km away</p> : <p>Loading distance...</p>}
          <p>{lists.ratings / lists.counts} rating</p>
          <p>{lists.type }  {lists.seats} seats</p>
        </div>
      </Link>
    </div>
  );
}

export default Driver;
