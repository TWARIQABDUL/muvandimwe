import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from '@firebase/auth';
import Error from './error';
function Login() {
    const navigate = useNavigate()
    // const [loading,setLoading]=useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const [idisabled, isdisabled] = useState(false)
    const LoginUser = () => {
        isdisabled(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                isdisabled(false)
                navigate("/")
            })
            .catch((error) => {
                const errorMessage = formatFirebaseError(error);
                setError(errorMessage);
                console.log(error);
                isdisabled(false);
                setTimeout(() => {
                    setError("");
                  }, 5000);
            })

        // format error 
        const formatFirebaseError = (error) => {
            let errorMessage = 'An error occurred.';

            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'User not found. Please check your email and try again.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid password. Please try again.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid Email. Please try again.';
                        break;
                    case 'auth/missing-password':
                        errorMessage = 'Missing password fiel. Please try again.';
                        break;
                        case 'auth/network-request-failed':
                        errorMessage = 'Connection problem. Please try again.';
                        break;
                    default:
                        errorMessage = "Contact Our team";
                }
            }

            return errorMessage;
        };
    }
    return (
        <div className='login-parent'>
            <div className="login-form">
                <h1>Welcome Back</h1>
                {error ? <Error message={error} /> : ""}
                <div className="inputs">
                    <input type="email" placeholder='example@example.com' value={email} name="" className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder='password' value={password} name="" className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    {idisabled ? <div className="login-button">waiting...</div> : <button type="submit" className='login-button' onClick={LoginUser}>Login</button>}
                    <p>Don't have account <Link to='/signup'>Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login