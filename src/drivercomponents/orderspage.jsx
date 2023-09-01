import React, { useState } from 'react'
import LetterAvatar from 'react-letter-avatar';
import arow from '../images/arrow-right.png'
import { useContext } from 'react';
import { SessionContext } from '../session';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '../firebase';
import Startorder from './startorder';


function Orderspage({ orders }) {
    const { session, userInfo } = useContext(SessionContext);
    const [showCard,setShowCard] = useState(false)
    const customerId = session?.uid || '';
    const startRide =()=>{
        setShowCard(!showCard)
    }
    // console.log(userInfo);
    const acceptOrderRequest = async (orderID) => {
        try {
            // Reference the specific document you want to update
            const orderDocRef = doc(db, 'orders', orderID);

            // Update the 'status' field to 'cancelled'
            updateDoc(orderDocRef, {
                status: 'Accepted',
            }).then(() => {
                console.log("fine all");
                // showAlert("Requst to Cancel", "your request has been sent to tour driver please wait")
            })

            // console.log(`Order ${orderID} has been cancelled.`);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    }
    return (
        <>
        <div className="card shadow">
            <div className="driver-infos">
                <LetterAvatar name={orders.userdata.name} size={100} />
                <div className='info'>
                    <p>Name: <span>{orders.userdata.name}</span></p>
                    <p>Ratings: <span>{orders.userdata.ratings}</span></p>
                    <p>customer: <span>location</span></p>
                    <p>Status: <span>{orders.status}</span></p>
                </div>
            </div>
            <div className="status">

                {(orders.status == "active") ?
                    <button className='login-button'
                        onClick={() => { acceptOrderRequest(orders.id) }}
                    >Accept </button> : <button
                    onClick={startRide}
                        className='login-button'>Start
                    </button>
                }
            </div>
        </div>
        {showCard ? <Startorder client={orders}/> : ""}

        </>
    )
}

export default Orderspage