import React, {useContext} from 'react'
import LetterAvatar from 'react-letter-avatar';
import { SessionContext } from '../session';
import Loading from './loadinf';
function Driver() {
    const { session } = useContext(SessionContext);
    function extractLetter(string) {
        return string.charAt(0).toUpperCase();
    }
    if (session == null) {
        return <Loading/>
    }else{
        const letel = extractLetter(session.displayName)
        return (
            <div className='driver-holder'>
                <div className="driver-profile">
                    <LetterAvatar name={letel} size={50} radius={50} />
                    {session.displayName}
                </div>
                <div className="driver-info">
                    <p>0.5Km away</p>
                    <p>5/7 rating</p>
                    <p>BMWz 8 seats</p>
                </div>
            </div>
        )
        }
}

export default Driver