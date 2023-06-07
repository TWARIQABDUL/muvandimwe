// import app from "../firebase"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db, provider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from '@firebase/auth';
import { collection, doc, setDoc } from '@firebase/firestore';
function Signup() {
    const [idisabled, isdisabled] = useState(false)
    const userCollectionRef = collection(db, "users")
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const navigate = useNavigate()
    const createUser = async (uid, names) => {
        const my_info = {
            name: names,
        }
        const docRef = doc(userCollectionRef, uid)
        const adduser = await setDoc(docRef, my_info)
    }
    const signUp = async (e) => {
        isdisabled(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentils) => {
                createUser(userCredentils.user.uid, username)
                    .then(suc => {
                        isdisabled(false)
                        navigate("/")
                    })
            })
            .catch((err) => {
                navigate("/error")
            })
    }
    const emailSignUp = () => {
        isdisabled(true)
        signInWithPopup(auth, provider)
            .then((users) => {
                createUser(users.user.uid, users.user.displayName)
                    .then(suc => {
                        isdisabled(false)
                        navigate("/")
                    })
            }).catch(err => {
                navigate("/error")
            })
    }
    return (
        <div className='login-parent'>
            <div className="login-form">
                <h1>Create Account</h1>
                <div className="inputs">
                    <input type="text" value={username} placeholder='example@example.com' className='input' onChange={(e) => { setUserName(e.target.value) }} />

                    <input type="email" value={email} placeholder='example@example.com' className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" value={password} placeholder='password' className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    <button type="submit" className='login-button' disabled={idisabled} onClick={signUp}>Create Acount</button>
                    <p>allready have account <Link to="/signin">Sign In</Link></p>
                    <button type="submit" className='login-button' disabled={idisabled} onClick={emailSignUp}>Continue with Google</button>
                </div>
            </div>
        </div>
    )
}

export default Signup