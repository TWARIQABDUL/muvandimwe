import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Geolocation } from '@capacitor/geolocation';
import im from "../images/myloc.png"
import Loading from './loadinf';
import { SessionContext } from '../session';
function Map() {
  const [position, setPosition] = useState(null);
  const { session } = useContext(SessionContext);
  useEffect(() => {
    const getPosition = async () => {
      try {
        const { coords } = await Geolocation.getCurrentPosition();
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      } catch (error) {
        console.log(error);
      }
    };
    getPosition();
  }, []);

  if (!position) {
    return <Loading />;
  }
  const pointA = [position.lat, position.lng];
  const pointB = [51.51, -0.05];
  const latLngA = L.latLng(pointA[0], pointA[1]);
  const latLngB = L.latLng(pointB[0], pointB[1]);
  const distance = latLngA.distanceTo(latLngB);
  console.log(distance);
  const myIcon = L.icon({
    iconUrl: im,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  return (
    <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[position.lat, position.lng]} icon={myIcon}>
        <Popup>
          (you) {session.displayName}
        </Popup>
        <Polyline positions={[pointA, pointB]} color="red" />
      </Marker>
    </MapContainer>
  );
}

export default Map