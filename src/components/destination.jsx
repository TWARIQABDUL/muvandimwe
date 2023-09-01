import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Driver from './driver';
import { SessionContext } from '../session';
import Tablerows from './tablerows';
import Box from './box';


function Destination() {
    const [load, setLoad] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('driver');
    const { session } = useContext(SessionContext);
    const [placeName, setPlaceName] = useState('');
    const [destin, setDestination] = useState('');
    const [spot, setSpot] = useState(null);
    const [success, setSuccess] = useState(false);
    const API_KEY = '5d9c0866e28d49438f54ac4db78c33fe';
    const [driverInfo, setDriverInfo] = useState([]);
    const [pending, setPending] = useState(true);
    const [matchingDocuments, setMatchingDocuments] = useState([]);
    const [userHistory, setUserHistory] = useState([])
    const customerId = session?.uid || '';
    const getInput = (e) => {
        setDestination(e.target.value);
    };

    const showAlert = async (messageTitle, messageBody) => {
        await Dialog.alert({
            title: messageTitle,
            message: messageBody,
        });
    };

    const showConfirm = async () => {
        const { value } = await Dialog.confirm({
            title: 'Confirm',
            message: `Are you sure you'd like to order?`,
        });
        return value;
    };

    const checkPreviousOrder = async () => {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('customerid', '==', session.uid),
            where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const makeOrder = async (location) => {
        setSuccess(true);
        const hasPreviousOrder = await checkPreviousOrder();
        if (hasPreviousOrder) {
            showAlert('Pending Order', 'You still have a pending order');
            setSuccess(false);
            return false;
        } else {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            const order = {
                driverid: id,
                customerid: session.uid,
                location: location,
                date: formattedDate,
                status: 'active',
            };
            try {
                const collectionRef = collection(db, 'orders');
                await addDoc(collectionRef, order);
                setDestination('');
                setSuccess(false);
                return true;
            } catch (error) {
                console.log('Error making order:', error);
                setSuccess(false);
                return false;
            }
        }
    };

    const handleOrder = async () => {
        setSuccess(true);
        if (destin.trim() !== '') {
            try {
                const shouldProceed = await showConfirm();
                if (shouldProceed) {
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${destin}&key=${API_KEY}`
                    );
                    const { results } = response.data;
                    if (results.length > 0) {
                        setSpot(results[0].geometry);
                        const orderPlaced = await makeOrder(results[0].geometry);
                        if (orderPlaced) {
                            showAlert("success!", "thank you for using our services enjoy the ride")
                            // navigate(`../myride?myid=${session.uid}`);
                        }
                    } else {
                        showAlert('Location Not Found', 'Currently, our service is not available in this area');
                        setSuccess(false);
                    }
                }
            } catch (error) {
                console.log('Error handling order:', error);
                setSuccess(false);
            }
        } else {
            showAlert('Order Not Placed', 'The location was not found');
            setSuccess(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const position = await Geolocation.getCurrentPosition();
                const { latitude, longitude } = position.coords;
                const response = await axios.get(
                    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
                );
                const { results } = response.data;
                if (results.length > 0) {
                    const { formatted } = results[0];
                    setPlaceName(formatted);
                    setPending(false);
                }
            } catch (error) {
                console.log('Failed to get data:', error);
            }
        };

        const getDriverInfo = async () => {
            try {
                const driverDocRef = doc(db, 'drivers', id);
                const driverDocSnap = await getDoc(driverDocRef);
                if (driverDocSnap.exists()) {
                    const driverData = driverDocSnap.data();
                    setDriverInfo([driverData]);
                }
            } catch (error) {
                console.log('Error getting driver information:', error);
            }
        };
        // only the driver information
        const getDriverDocumentById = async (documentId) => {
            try {
                const docRef = doc(db, "drivers", documentId);
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
        };
        //   dont change anything if you dont know anything
        const searchCustomerById = async (customerId) => {
            const customersRef = collection(db, 'orders');
            const q = query(customersRef, where('customerid', '==', customerId), where('status', '==', 'active'));
            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    console.log('No matching documents found.');
                    setMatchingDocuments([]);
                } else {
                    const matchingDocuments = [];
                    querySnapshot.forEach(async (doc) => {
                        const data = doc.data();
                        const driverData = await getDriverDocumentById(data.driverid);
                        if (driverData) {
                            const driverInfo = { id: doc.id, ...data, driver: driverData };
                            matchingDocuments.push(driverInfo);
                            setMatchingDocuments([...matchingDocuments]);
                        }
                    });
                    setLoad(true);
                }
            } catch (error) {
                console.log('Error searching for documents:', error);
                setMatchingDocuments([]);
            }
        };
        //   get history information

        const getHistory = async (customerId) => {
            const customersRef = collection(db, 'orders');
            const q = query(customersRef,
                where('customerid', '==', customerId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                if (items) {
                    const userHistory = [];
                    items.forEach(async (doc) => {
                        const driverData = await getDriverDocumentById(doc.driverid);
                        if (driverData) {
                            const driverInfo = { id: doc.id, ...doc, driver: driverData };
                            userHistory.push(driverInfo);
                            setUserHistory([...userHistory]);
                            // console.log(driverInfo);
                            setLoad(true);

                        }
                    });
                }
                setLoad(true);
            });

            return () => unsubscribe();
            // try {
            //   const querySnapshot = await getDocs(q);
            //   if (querySnapshot.empty) {
            //     console.log('No matching documents found.');
            //     setUserHistory([]);
            //   } else {
            //     const userHistory = [];
            //     querySnapshot.forEach(async (doc) => {
            //       const data = doc.data();
            //       const driverData = await getDriverDocumentById(data.driverid);
            //       if (driverData) {
            //         const driverInfo = { id: doc.id, ...data, driver: driverData };
            //         userHistory.push(driverInfo);
            //         setUserHistory([...userHistory]);
            //       }
            //     });
            //     setLoad(true);
            //   }
            // } catch (error) {
            //   console.log('Error searching for documents:', error);
            //   setUserHistory([]);
            // }
        };


        // const searchCustomerById = async (customerId) => { //all orders info
        //     const customersRef = collection(db, 'orders');
        //     const q = query(customersRef, where('customerid', '==', customerId));
        //     try {
        //         const querySnapshot = await getDocs(q);
        //         if (querySnapshot.empty) {
        //             console.log('No matching documents found.');
        //             setMatchingDocuments([]);
        //         } else {
        //             const matchingDocuments = [];
        //             querySnapshot.forEach((doc) => {
        //                 const data = doc.data();
        //             getDriverDocumentById(data.driverid)
        //             .then(drivein => {
        //                 console.log(drivein);
        //             })
        //                 // console.log(data.driverid);
        //                 matchingDocuments.push({ id: doc.id, ...data });
        //             });
        //             console.log(matchingDocuments);
        //             setMatchingDocuments(matchingDocuments);
        //             setLoad(true);
        //         }
        //     } catch (error) {
        //         console.log('Error searching for documents:', error);
        //         setMatchingDocuments([]);
        //     }
        // };

        fetchData();
        getDriverInfo();
        searchCustomerById(customerId);
        getHistory(customerId)
    }, [id, customerId]);

    const placeNameInputValue = placeName ? placeName : 'Loading';

    return (
        <div className='form-holder'>
            {pending ? (
                'Loading'
            ) : (
                driverInfo.map((info) => <Driver key={info.ID} lists={info} />)
            )}
            <div className="login-form">
                <div className='inputs'>
                    <label htmlFor='from'>From</label>
                    <input
                        type='email'
                        id='from'
                        disabled
                        value={placeNameInputValue}
                        className='input'
                    />
                    <label htmlFor='to'>To</label>
                    <input
                        type='text'
                        id='to'
                        placeholder='To'
                        value={destin}
                        onChange={(e) => getInput(e)}
                        className='input'
                    />
                    {success ? (
                        <div className="login-button">waiting...</div>
                    ) : (
                        <button type='submit' onClick={handleOrder} className='login-button'>
                            Order Ride
                        </button>
                    )}
                </div>
            </div>
            {load &&
                matchingDocuments.sort().map((history) => (
                    <Box key={history.id} history={history} />
                ))}
            <div className="login-form table">
                <h2>History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Driver</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {load &&
                            userHistory.sort().map((history) => (
                                <Tablerows key={history.id} history={history} />
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Destination;