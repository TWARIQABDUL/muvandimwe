// import app from "../firebase"
import { createUserWithEmailAndPassword } from '@firebase/auth';
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { Link } from 'react-router-dom';
import { signInWithPopup } from '@firebase/auth';
function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const signUp = (e) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentils) => {
                console.log(userCredentils);
            })
            .catch((err) => {
                console.log("something went wrong");
            })
    }
    const emailSignUp = () => {
        signInWithPopup(auth, provider).then((user) => {
            console.log(user);
        })
    }
    return (
        <div className='login-parent'>
            <div className="login-form">
                <h1>Create Account</h1>
                <div className="inputs">
                    <input type="email" value={email} name="" id="" className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" value={password} name="" id="" className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    <button type="submit" className='login-button' onClick={signUp}>Create Acount</button>
                    <p>allready have account <Link to='/signin'>Sign In</Link></p>
                    <button type="submit" className='login-button' onClick={emailSignUp}>Continue with Google</button>
                    <button type="submit" className='login-button' onClick={signUp}>Continue with Facebook</button>
                </div>
            </div>
        </div>
    )
}

export default Signup