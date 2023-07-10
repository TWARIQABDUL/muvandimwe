import React, { useContext } from 'react'
import { SessionContext } from '../session'
import Map from './map'
import NavBar from './navbar'
import Products from './products'

function Home() {
  const { session } = useContext(SessionContext)
  // console.log(session.uid);

  return (
    <>
      <NavBar />
      <div className="service-lists">
        <Products />
      </div>
    </>


  )
}
export default Home