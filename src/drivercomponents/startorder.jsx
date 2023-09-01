import React from 'react'
import LetterAvatar from 'react-letter-avatar';

function Startorder({client}) {
    return (
        <div className="main-cards">
            <div className="cards">
            <div className="card-border-top">
            </div>
            <div className="img">
            <LetterAvatar
             name={client.userdata.name}
              size={70} radius={10}
              backgroundColor="#6b64f3"
               />

            </div>
            <span> {client.userdata.name}</span>
            <p className="job"> {client.userdata.ratings} stars</p>
            <input type="text" className='input' placeholder='Phone Number' />
            <button className='login-button'> Start</button>
            {/* <button> Click</button> */}
        </div>
        </div>
    )
}

export default Startorder