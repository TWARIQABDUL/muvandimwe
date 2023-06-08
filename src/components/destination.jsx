import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import { Link } from 'react-router-dom';
import Map from "./map"
function Destination() {
    const [placeName, setPlaceName] = useState('');
    const [destin,setDestination]= useState('');
    const [spot,setSpot]= useState()
    const API_KEY = "5d9c0866e28d49438f54ac4db78c33fe";
    const getInput = (e)=>{
        setDestination(e.target.value)
        // console.log(e.target.value);
    }
    const hundleOrder = async () => {
        try {
            const resultsName = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${destin}&key=${API_KEY}`)
            const { results } = resultsName.data;
            setSpot(results[0].geometry)
            console.log(spot);         
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
                to<input type="text" placeholder='to' value={destin} onChange={(e)=>getInput(e)} className='input' />
                <button type="submit"  onClick={hundleOrder} className='login-button'>Order Ride</button>
            </div>
            {spot && <Map dest={spot}/>}
        </div>
    )
}

export default Destination;
