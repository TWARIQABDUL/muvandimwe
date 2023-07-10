import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Geolocation } from '@capacitor/geolocation';
import im from "../images/myloc.png"
import Loading from './loadinf';
import { SessionContext } from '../session';
import { useNavigate } from 'react-router-dom';
function Map(prop) {
  const navigate = useNavigate()
  const [position, setPosition] = useState(null);
  const { session } = useContext(SessionContext);
  useEffect(() => {
    const getPosition = async () => {
      try {
        const { coords } = await Geolocation.getCurrentPosition();
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      } catch (error) {
        navigate("/error")
      }
    };
    getPosition();
  }, []);

  if (!position || !session || !session.displayName) {
    return <Loading />;
  }
  const pointA = [position.lat, position.lng];
  const pointB = [prop.dest.lat, prop.dest.lng];
  const latLngA = L.latLng(pointA[0], pointA[1]);
  const latLngB = L.latLng(pointB[0], pointB[1]);
  const distance = (latLngA.distanceTo(latLngB)) / 1000;
  console.log(prop.dest.lat);
  const myIcon = L.icon({
    iconUrl: im,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  return (
    <div className="map">
      <MapContainer center={[position.lat, position.lng]} zoom={10} style={{ height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[position.lat, position.lng]} icon={myIcon}>
        <Popup>
          (you) {session.displayName}
        </Popup>
        <Polyline positions={[pointA, pointB]} color="red" />
      </Marker>
      <Marker position={[prop.dest.lat, prop.dest.lng]} icon={myIcon}>
        <Popup>
          (Driver) {distance.toFixed(1) } Km
        </Popup>
        {/* <Polyline positions={[pointA, pointB]} color="red" /> */}
      </Marker>
    </MapContainer>
    </div>
    
  );
}

export default Map