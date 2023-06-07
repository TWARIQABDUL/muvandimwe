import React, {useEffect, useState } from 'react'
import Driver from './driver'
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'
import Loading from './loadinf'

function DriverList() {
  const [loaded, setLoaded] = useState(false);
  const [driverList, setDriverList] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDriverList(items);
      setLoaded(true);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  if (loaded) {
    const Drivers = driverList.map((drive) => <Driver key={drive.id} lists={drive} />);
    return <div className='drivers-list-holde'>{Drivers}</div>;
  }

  return (
    <div className='drivers-list-holde'>
      <Loading />
    </div>
  );
}

export default DriverList;