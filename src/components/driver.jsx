import React, { useEffect, useState } from 'react';
import LetterAvatar from 'react-letter-avatar';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
function Driver({ lists }) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate();

  const showAlert = async (msg) => {
    Dialog.alert({
      title: "Loading location failed",
      message: msg,
    })
  }
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { coords } = await Geolocation.getCurrentPosition();
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      } catch (error) {
        setPosition(null);
        console.log(error);
        showAlert(error.message, " Try to turn on Location")
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
      <Link to={`/destination?driver=${lists.id}`} className="link-black link-flex">
        <LetterAvatar name={letel} size={50} radius={50} />

        <div className="driver-info">
          <h2 className='title'>{lists.name}</h2>
          {/* {React.createElement('br')} */}
          <div className="bottom">
            {distance ? <p className='title'>{distance} Km away</p> : <p className='title'>Loading distance...</p>}
            <p className='title'>{(lists.ratings / lists.counts).toFixed(1)} rating</p>
            <p className='title'>{lists.type}  {lists.seats} seats</p>
          </div>
        </div>

      </Link>
    </div>
  );
}

export default Driver;
