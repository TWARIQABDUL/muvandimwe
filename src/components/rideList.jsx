import React, { useContext, useEffect, useState } from 'react'
import Driver from './driver'
import { collection, getDocs } from '@firebase/firestore'
import { db } from '../firebase'
import Loading from './loadinf'

function DriverList() {
const [loaded,setLoaded] = useState(false)
const [driverList,setDriverList] = useState([])
useEffect(()=>{
  const fetchDrivers = async ()=>{
    try{
      const querySnapshot = await getDocs(collection(db,"drivers"))
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
      setDriverList(items)
      setLoaded(true)
    }catch{
      console.log("some error acured");
    }
  }
  fetchDrivers()
})
if (loaded) {
  const Drivers = driverList.map((drive)=> <Driver key={drive.id} lists={drive}/>)
  return(
    <div className='drivers-list-holde'>
      {Drivers}
    </div>
  )
}
  return (
    <div className='drivers-list-holde'>
      <Loading/>
    </div>
  )
}

export default DriverList