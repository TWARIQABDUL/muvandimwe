import React, { useEffect, useState } from 'react'
import Driver from './driver'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase'
import Loading from './loadinf'

function DriverList() {
  const [loaded, setLoaded] = useState(false);
  const [driverList, setDriverList] = useState([]);

  useEffect(() => {
    const customersRef = collection(db, 'drivers');
            const q = query(customersRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDriverList(items);
      console.log(items);
      setLoaded(true);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  if (loaded) {
    const Drivers = driverList.map((drive) => <Driver key={drive.id} lists={drive} />);
    return (
      <div className="service-lists">
        <div className='drivers-list-holde'>{Drivers}</div>
      </div>);
  }

  return (
    <div className='drivers-list-holde'>
      <Loading />
    </div>
  );
}

export default DriverList;