import React from 'react'
import Product from './product'
import car from "../images/car.png"
import burger from "../images/hamburger.png"
import hotels from "../images/hotel.png"

function Products() {
  return (
    <div className='main-product-holder'>
        <Product img={car} title="Ride"/>
        <Product img={burger} title="Restaurant"/>
        <Product img={hotels} title="Hotels"/>
        <Product img={car} title=""/>
        <Product img={car} title=""/>


    </div>
  )

}

export default Products