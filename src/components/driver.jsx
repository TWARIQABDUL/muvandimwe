import React, { useEffect, useState } from 'react';
import LetterAvatar from 'react-letter-avatar';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
function Driver({ lists }) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
          const { coords } = await Geolocation.getCurrentPosition();
          setPosition({ lat: coords.latitude, lng: coords.longitude });
      } catch (error) {
        setPosition(null);
        console.log(error);
        navigate("/error");
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
      setDistance(Number(distanceInKilometers.toFixed(1)));
    }
  }, [position]);

  function extractLetter(string) {
    return string.charAt(0).toUpperCase();
  }
// console.log(lists);
  const letel = extractLetter(lists.name);
  return (
    <div className="driver-holder">
      <Link to={`/destination?driver=${lists.id}`} className="link-black">
        <div className="driver-profile">
          <LetterAvatar name={letel} size={50} radius={50} />
          {lists.name}
        </div>
        <div className="driver-info">
          {distance ? <p>{distance} Km away</p> : <p>Loading distance...</p>}
          <p>{(lists.ratings / lists.counts).toFixed(1)} rating</p>
          <p>{lists.type }  {lists.seats} seats</p>
        </div>
      </Link>
    </div>
  );
}

export default Driver;
