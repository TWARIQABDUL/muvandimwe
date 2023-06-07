import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {auth} from "../firebase"
import {signInWithEmailAndPassword } from '@firebase/auth';
import Error from './error';
function Login() {
    const navigate = useNavigate()
    // const [loading,setLoading]=useState(false)
    const [error,setError]= useState("")
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const [idisabled,isdisabled]= useState(false)
    const LoginUser = () => {
        isdisabled(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userStatus) => {
                isdisabled(false)
                navigate("/")
            })
            .catch((error) => {
                setError(error.code);
                navigate("/error")
            })
    }
    return (
        <div className='login-parent'>
            <div className="login-form">
                <h1>Welcome Back</h1>
                <Error message={error}/>
                <div className="inputs">
                    <input type="email" placeholder='example@example.com' value={email} name="" className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder='password' value={password} name="" className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    <button type="submit" className='login-button' disabled={idisabled} onClick={LoginUser}>Login</button>
                    <p>Don't have account <Link to='/signup'>Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login