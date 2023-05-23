import React from 'react'
import { Link } from 'react-router-dom'
function Product(prop) {
    return (
        <Link to={prop.title} className='product-holder link-black'>
            <img src={prop.img} alt="" />
            <p>{prop.title}</p>
        </Link>
    )
}

export default Product