import React, { useContext, useEffect, useState } from 'react'
import {SessionContext, SessionProvider } from '../session'
import { signOut } from '@firebase/auth'
import { auth } from '../firebase'
import Map from './map'

function Home() {
    const {session} = useContext(SessionContext)
    // console.log(session.uid);
    const logOut =()=>{
        signOut(auth).then(som =>{
            console.log(som);
        }).catch(err =>{
            console.log(err);
        })
    }
  return (
    <div>welcome  {session.email}
    <Map/>
    <button type="submit" onClick={logOut}>Log Out</button>
    </div>
  )
}

export default Home