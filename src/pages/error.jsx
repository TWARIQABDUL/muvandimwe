import React from 'react'
import { Link } from 'react-router-dom'

function ErrorHandler({erro}) {
  return (
    <div className="error-container">
        <h4>Error Message</h4>
        <Link to="prev">Reload</Link>
    </div>
  )
}

export default ErrorHandler