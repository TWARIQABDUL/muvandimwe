import React from 'react'
import LetterAvatar from 'react-letter-avatar';
import arow from '../images/arrow-right.png'
function Box({ history }) {
    console.log(history);
    return (
        <div className="card shadow">
            <div className="driver-infos">
                <LetterAvatar name={history.driver.name} size={100}  />
                <div className='info'>
                    <p>Name: <span>{history.driver.name}</span></p>
                    <p>Ratings: <span>{history.driver.ratings}</span></p>
                    <p>car: <span>{history.driver.type}</span></p>
                </div>

            </div>
            <div className="status">
                    <p>{history.status}</p>
                    <img src={arow} alt="" className='icon' />
                </div>
        </div>
    )
}

export default Box