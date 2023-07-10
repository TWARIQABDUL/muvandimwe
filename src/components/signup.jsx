import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db, provider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from '@firebase/auth';
import { collection, doc, setDoc } from '@firebase/firestore';
import Error from './error';
function Signup() {
    const [idisabled, isdisabled] = useState(false)
    const [error, setError] = useState("")
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
        await setDoc(docRef, my_info)
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
                const errorMessage = formatFirebaseError(err);
                setError(errorMessage);
                console.log(error);
                isdisabled(false);
                setTimeout(() => {
                    setError("");
                  }, 5000);
                // navigate("/error")
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
                // navigate("/error")
            })
    }
    // format Eroor 
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
    return (
        <div className='login-parent'>
            <div className="login-form">
            {error ? <Error message={error} /> : ""}
                <h1>Sign Up</h1>
                <div className="inputs">
                    <input type="text" value={username} placeholder='John Doe' required className='input' onChange={(e) => { setUserName(e.target.value) }} />
                    <input type="email" value={email}  placeholder='example@example.com' className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" value={password} placeholder='password' className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    {idisabled ? <div className='login-button'>waiting</div> :  <button type="submit" className='login-button' disabled={idisabled} onClick={signUp}>Create Acount</button>}
                    <Link to="/signin" className='signup'>Sign In</Link>
                    {/* <button type="submit" className='login-button' disabled={idisabled} onClick={emailSignUp}>Continue with Google</button> */}
                </div>
            </div>
        </div>
    )
}

export default Signup