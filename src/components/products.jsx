import React from 'react'
import Product from './product'
import car from "../images/car.png"
import burger from "../images/restaurant.png"
import hotels from "../images/hotel.png"
import apartment from '../images/apartment.png'
import cofee from '../images/cofee.png'

function Products() {
  return (
    <div className='main-product-holder'>
        <Product img={car} title="Ride"/>
        <Product img={burger} title="Restaurant"/>
        <Product img={hotels} title="Hotels"/>
        <Product img={apartment} title="apartment"/>
        <Product img={cofee} title="Cofee-shop"/>


    </div>
  )

}

export default Products