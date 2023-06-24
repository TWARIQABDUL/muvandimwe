import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import im from "../images/soundcard.jpeg"
import { SessionContext } from '../session'
import { signOut } from '@firebase/auth'
import { auth } from '../firebase'
function NavContent() {
    const {session} = useContext(SessionContext)
    const logOut =()=>{
        signOut(auth).then(som =>{
            console.log(som);
        }).catch(err =>{
            console.log(err);
        })
    }
  return (
    <div className="nav-content">
        <div className="use-info">
            <img src={im} alt="" />
            <div className='names'>
                <h4>{session.displayName}</h4>
                <Link to='edit' className='list-black'>Edit Profile</Link>
            </div>
        </div>
        <ul>
            <li><Link to="#">My Activity</Link></li>
            <li><Link to="../myride">Track Ride</Link></li>
            <li><Link to="#">Q&A</Link></li>
            <li><Link to="#">help</Link></li>
            <li><Link to="#">report problem</Link></li>
            <li><Link to="#">how we protect your privacy</Link></li>
        </ul>
        <button onClick={logOut} className='login-button log-out'>Log out</button>
    </div>
  )
}

export default NavContent