import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/navbar'
import Products from '../components/products'
import Box from '../components/box'
import Orderspage from './orderspage'
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from '@firebase/firestore'
import { db } from '../firebase'
import { SessionContext } from '../session'

function Driverhome() {
  const { session, } = useContext(SessionContext);
  const [ordersList, setOrdersList] = useState([])
  const driverId = session?.uid || '';
  const getUserInfo = async (userid) => {
    // console.log(userid);
    try {
      const docRef = doc(db, "users", userid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, return the data
        return docSnap.data();
      } else {
        // Document does not exist
        return null;
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
      return null;
    }
  }
  
  useEffect(() => {
    const customersRef = collection(db, 'orders');
    const q = query(customersRef, where("driverid", "==", driverId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const combinedData = []

      items.forEach(async (datax) => {
        const dt = await getUserInfo(datax.customerid)
        if (dt) {
          const driverInfo = { id: datax.id, ...datax, userdata: dt };
          combinedData.push(driverInfo);
          setOrdersList(combinedData)

          console.log(ordersList);
        }

        // console.log(dt);
      })
      // await getUserInfo()
      // console.log(ordersList);
      // setLoaded(true);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  return (
    <>
      <NavBar />
      <div className="service-lists main-drivers">
        {
          ordersList.map((order) => <Orderspage key={order.id} orders={order} />)
        }

      </div>
    </>
  )
}

export default Driverhome