import React, { useContext} from 'react'
import {SessionContext} from '../session'
import { signOut } from '@firebase/auth'
import { auth } from '../firebase'
import Map from './map'
import NavBar from './navbar'
import Products from './products'

function Home() {
    const {session} = useContext(SessionContext)
    // console.log(session.uid);
    
  return (
    <>
    <NavBar/>
    <Products/>
    {/* <Map/> */}
    </>
    

  )
}
export default Home