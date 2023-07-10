import React, { useState, useEffect } from 'react';
import NavBar from './navbar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import Map from './map';

function Myride() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('myid');
  const [matchingDocuments, setMatchingDocuments] = useState([]);
  
  useEffect(() => {
    const searchCustomerById = async (customerId) => {
      const customersRef = collection(db, 'orders');
      // Create a query to filter documents based on the customer ID
      const q = query(customersRef, where('customerid', '==', customerId));
      try {
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('No matching documents found.');
          setMatchingDocuments([]);
        } else {
          // Iterate over the query snapshot and retrieve the matching documents
          const matchingDocuments = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            matchingDocuments.push({ id: doc.id, ...data });
          });
          
          setMatchingDocuments(matchingDocuments);
        }
      } catch (error) {
        console.log('Error searching for documents:', error);
        setMatchingDocuments([]);
      }
    };
  
    const customerId = id;
    searchCustomerById(customerId);
  }, [id]);
  console.log(id);
  const pos = {
    lat: -2.6053426,
    lng: 29.7401547
  };
  
  return (
    <div>
      <NavBar />
      <div className="drivers-list-holde">
        <Map dest={pos} />
        <button type="submit" className='login-button'>Cancel Order</button>
        {matchingDocuments.length > 0 ? (
          <div>
            <h3>Matching Documents:</h3>
            <ul>
              {matchingDocuments.map((document) => (
                <li key={document.id}>{document.status}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No matching documents found.</p>
        )}
      </div>
    </div>
  );
}

export default Myride;
