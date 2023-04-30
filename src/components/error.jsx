import React from 'react'

export default function Error({message}) {
  return (
    <div className="error_holder">
        <div className="error_box">
        <p>{message}</p>
        </div>
    </div>
  )
}
