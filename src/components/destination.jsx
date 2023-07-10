import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Map from './map';
import Driver from './driver';
import { SessionContext } from '../session';
import check from '../images/check.png'
import cance from '../images/close.png'

function Destination() {
    const [mes, setMes] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('driver');
    const { session } = useContext(SessionContext);
    const [placeName, setPlaceName] = useState('');
    const [destin, setDestination] = useState('');
    const [spot, setSpot] = useState(null);
    const [success, setSuccess] = useState(false);
    const API_KEY = '5d9c0866e28d49438f54ac4db78c33fe';
    const [driveInfo, setDriverInfo] = useState([]);
    const [pending, setPending] = useState(true);
    const navigate = useNavigate();

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
            const order = {
                driverid: id,
                customerid: session.uid,
                location: location,
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
                            navigate(`../myride?myid=${session.uid}`);
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

        fetchData();
        getDriverInfo();
    }, [id]);

    const placeNameInputValue = placeName ? placeName : 'Loading';

    return (
        <div className='form-holder'>
            {pending ? (
                'Loading'
            ) : (
                driveInfo.map((info) => <Driver key={info.id} lists={info} />)
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
                    {success ? <div className="login-button">waiting...</div> : <button type='submit' onClick={handleOrder} className='login-button'>Order Ride</button>}
                </div>
            </div>
            <div className="login-form table">
            <table>
                <tr>
                    <th>date</th>
                    <th>driver</th>
                    <th>action</th>
                </tr>
                <tbody>
                    <tr>
                        <td>12-02-2023</td>
                        <td>jack maize</td>
                        <td><img src={cance} className='icon cancel' /> {React.createElement('br')} pending</td>
                    </tr>
                    <tr>
                        <td>12-02-2023</td>
                        <td>jack maize</td>
                        <td><img src={check} className='icon' /> {React.createElement('br')} succes</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default Destination;
