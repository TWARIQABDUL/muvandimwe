import React from 'react'
import succes from '../images/check.png'
import active from '../images/close.png'
function Tablerows({ history }) {
    return (
        <tr>
            <td>{history.date}</td>
            <td>{history.driver.name}</td>
            <td><img src={(history.status === 'succes') ? succes : active} className='icon cancel' /> {React.createElement('br')} {history.status}</td>
        </tr>
    )
}

export default Tablerows