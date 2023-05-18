// import app from "../firebase"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db, provider } from '../firebase';
import { Link } from 'react-router-dom';
import { signInWithPopup } from '@firebase/auth';
import { collection, doc, setDoc } from '@firebase/firestore';
function Signup() {
    const userCollectionRef = collection(db, "users")
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const createUser = async (uid, names) => {
        const my_info = {
            name: names,
        }
        const docRef = doc(userCollectionRef, uid)
        const adduser = await setDoc(docRef, my_info)
    }
    const signUp = async (e) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentils) => {
                console.log(userCredentils.user.uid);
                createUser(userCredentils.user.uid, username)
                    .then(suc => {
                        console.log(suc);
                    })
            })
            .catch((err) => {
                console.log("something went wrong");
            })
    }
    const emailSignUp = () => {
        signInWithPopup(auth, provider)
            .then((users) => {
                // console.log(users.user.uid);
                createUser(users.user.uid, users.user.displayName)
                    .then(suc => {
                        console.log(suc);
                    })
                // console.log(user);
            }).catch(err => {
                console.log(err);
            })
        // console.log("hhh");
    }
    return (
        <div className='login-parent'>
            <div className="login-form">
                <h1>Create Account</h1>
                <div className="inputs">
                    <input type="text" value={username} placeholder='example@example.com' className='input' onChange={(e) => { setUserName(e.target.value) }} />

                    <input type="email" value={email} placeholder='example@example.com' className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" value={password} placeholder='password' className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    <button type="submit" className='login-button' onClick={signUp}>Create Acount</button>
                    <p>allready have account <Link to="/signin">Sign In</Link></p>
                    <button type="submit" className='login-button' onClick={emailSignUp}>Continue with Google</button>
                    {/* <button type="submit" className='login-button' onClick={signUp}>Continue with Facebook</button> */}
                </div>
            </div>
        </div>
    )
}

export default Signup