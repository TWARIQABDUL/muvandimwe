import React, { useContext} from 'react'
import {SessionContext} from '../session'
import { signOut } from '@firebase/auth'
import { auth } from '../firebase'
import Map from './map'
import NavBar from './navbar'

function Home() {
    const {session} = useContext(SessionContext)
    // console.log(session.uid);
    
  return (
    <>
    <NavBar/>
    <Map/>
    </>
    

  )
}
export default Home