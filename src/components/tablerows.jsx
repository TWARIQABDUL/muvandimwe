import React from 'react'
import succes from '../images/check.png'
import active from '../images/close.png'
import { db } from '../firebase';
import { doc, updateDoc } from '@firebase/firestore';
import { Dialog } from '@capacitor/dialog';
function Tablerows({ history }) {
    const showAlert = async (messageTitle, messageBody) => {
        await Dialog.alert({
            title: messageTitle,
            message: messageBody,
        });
    };
    const cancelOrderRequest = async (orderID) => {
        try {
            // Reference the specific document you want to update
            const orderDocRef = doc(db, 'orders', orderID);

            // Update the 'status' field to 'cancelled'
            updateDoc(orderDocRef, {
                status: 'requested',
            }).then(() => {
                showAlert("Requst to Cancel", "your request has been sent to tour driver please wait")
            })

            // console.log(`Order ${orderID} has been cancelled.`);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    }
    // console.log(history);
    return (
        <tr>
            <td>{history.date}</td>
            <td>{history.driver.name}</td>
            <td><img
                src={(history.status === 'succes') ? succes : active}
                className='icon cancel' onClick={() => { cancelOrderRequest(history.id) }}

            /> {React.createElement('br')} {history.status}</td>
            {/* <td><img src={(history.status === 'succes') ? succes : active} className='icon cancel' /> {React.createElement('br')} {history.status}</td> */}
        </tr>
    )
}

export default Tablerows