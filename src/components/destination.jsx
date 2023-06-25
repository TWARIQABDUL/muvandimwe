import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import Map from "./map"
import { SessionContext } from '../session';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import { Dialog } from '@capacitor/dialog';
function Destination() {
    const [mes, setMes] = useState()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('driver');
    const [procced, setProcced] = useState(false)
    const { session } = useContext(SessionContext);
    const [placeName, setPlaceName] = useState('');
    const [destin, setDestination] = useState('');
    const [spot, setSpot] = useState()
    const API_KEY = "5d9c0866e28d49438f54ac4db78c33fe";
    const getInput = (e) => { //get the inputs 
        setDestination(e.target.value)
    }//end 

    const showConfirm = async () => {
        const { value } = await Dialog.confirm({
            title: 'Confirm',
            message: `Are you sure you'd like to order `,
        });
        setProcced(value)
        return value
    };
    const makeOrder = async (loc) => { //makes the order
        const object = {
            driverid: id,
            customerid: session.uid,
            location: loc
        }
        try {
            console.log(loc);
            const collectionRef = collection(db, 'orders')
            addDoc(collectionRef, object)
                .then((succ) => {
                    setDestination('')
                })
                .catch(er => {
                    console.log(er);
                })
        } catch (error) {
            console.log("fuck", error);
        }
        return mes
    }//end order
    const hundleOrder = async () => {//hundle the order

        try {
            showConfirm().then(pr => {
                if (pr) {
                    axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${destin}&key=${API_KEY}`)
                        .then(datas => {
                            const { results } = datas.data;
                            setSpot(results[0].geometry)
                            // console.log(results[0].geometry);
                            makeOrder(results[0].geometry)
                                .then(suc => {
                                    console.log("succes", suc);
                                })
                        })

                }
            })
        } catch (error) {

        }
    }
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
                    //   console.log(formatted);
                }
            } catch (error) {
                console.log("Failed to get data:", error);
            }
        };

        fetchData();
    }, [spot]);

    return (
        <div className='form-holder'>
            <div className="inputs">
                from<input type="email" disabled value={placeName ? placeName : "Loading"} className='input' />
                to<input type="text" placeholder='to' value={destin} onChange={(e) => getInput(e)} className='input' />
                <button type="submit" onClick={hundleOrder} className='login-button'>Order Ride</button>
            </div>
            {spot && <Map dest={spot} />}
        </div>
    )
}

export default Destination;
