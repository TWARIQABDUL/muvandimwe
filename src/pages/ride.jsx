import React, { useEffect } from 'react'
import NavBar from '../components/navbar'
import DriverList from '../components/rideList'
import { Geolocation } from '@capacitor/geolocation';
import { useNavigate } from 'react-router-dom';

function Ride() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkPermison = async () => {
      try {
        const permissionStatus = await Geolocation.checkPermissions();
        const hasPermission = permissionStatus.location === 'granted';
        if (!hasPermission) {
          navigate("/error")
        }
      } catch (error) {
        navigate("/error")
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