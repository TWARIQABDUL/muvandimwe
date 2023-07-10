import React, { useEffect } from 'react'
import NavBar from '../components/navbar'
import DriverList from '../components/rideList'
import { Geolocation } from '@capacitor/geolocation';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@capacitor/dialog';

function Ride() {
  const showAlert = async (mesagetit,mesagebody) => {
    await Dialog.alert({
        title: mesagetit,
        message: mesagebody,
    });
};
  const navigate = useNavigate();
  useEffect(() => {
    const checkPermison = async () => {
      try {
        const permissionStatus = await Geolocation.checkPermissions();
        const hasPermission = permissionStatus.location === 'granted';
        if (!hasPermission) {
          const permissionRequest = await Geolocation.requestPermissions();
          const permissionGranted = permissionRequest.location === 'granted';
          if (!permissionGranted) {
            showAlert('Location Not Enabled', 'Please enable location or turn it on to use this feature.');
            // navigate("/error")
          }
        }
      } catch (error) {
        showAlert("location",error.message)
      }
    }
    checkPermison()
  }, [])
  return (
    <div>
      <NavBar />
      <DriverList />
    </div>
  )
}

export default Ride