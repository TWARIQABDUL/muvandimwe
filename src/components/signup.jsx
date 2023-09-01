import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db, provider } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from '@firebase/auth';
import { GeoPoint, collection, doc, setDoc } from '@firebase/firestore';
import Error from './error';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
function Signup() {
    const [idisabled, isdisabled] = useState(false)
    const [error, setError] = useState("")
    const userCollectionRef = collection(db, "users")
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPaswword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [Id, setId] = useState("")
    const [numberOfSeats, setNumberOfSeats] = useState("")
    const [carType, setCarType] = useState("")
    const [position,setPosition] = useState("")
    const [other, showOther] = useState(false)
    const navigate = useNavigate()
    const getInitialState = () => {
        const value = "user";
        return value;
    };
    const [category, setCategory] = useState(getInitialState)

    // const [value, setValue] = useState();
    const showAlert = async (msg) => {
        Dialog.alert({
          title: "Loading location failed",
          message: msg,
        })
      }
    const handleChange = (e) => {
        setCategory(e.target.value);
        if (e.target.value == "driver") {
            showOther(true)
        } else {
            showOther(false)

        }
        // console.log(e.target.value); // You can directly log the updated value here.
    };

    const createUser = async (uid, names) => {
        const my_info = {
            name: names,
            category: category
        }
        const docRef = doc(userCollectionRef, uid)
        setDoc(docRef, my_info)
        .then(async () =>{
            if (category == "driver") {
            await registerDriver(uid)
            }
            showAlert("registered succefull")
        })
    }
    const registerDriver = async (uid) => {
        const geoPosition = new GeoPoint(position.lat, position.lng);
        const driverCollection = collection(db,"drivers")
        const driver_info = {
            counts :1,
            location: geoPosition,
            name:username,
            ratings:0,
            seats : numberOfSeats,
            type:carType,
            ID:Id,
            phone:phoneNumber
        }
        const docRef = doc(driverCollection,uid)
        await setDoc(docRef,driver_info)
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
    useEffect(() => {
        const checkLocationPermission = async () => {
          try {
            const { coords } = await Geolocation.getCurrentPosition();
            setPosition({ lat: coords.latitude, lng: coords.longitude });
          } catch (error) {
            setPosition(null);
            console.log(error);
            showAlert(error.message, " Try to turn on Location")
          }
        };
        checkLocationPermission();
      }, []);
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
    console.log(position);

    return (
        <div className='login-parent'>
            <div className="login-form">
                {error ? <Error message={error} /> : ""}
                <h1>Sign Up</h1>
                <div className="inputs">
                    <input type="text" value={username} placeholder='John Doe' required className='input' onChange={(e) => { setUserName(e.target.value) }} />
                    <input type="email" value={email} placeholder='example@example.com' className='input' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" value={password} placeholder='password' className='input' onChange={(e) => { setPaswword(e.target.value) }} />
                    <select value={category} onChange={handleChange} className='input'>
                        <option value="user" className='input'>User</option>
                        <option value="driver" className='input'>Driver</option>
                    </select>
                    {other ?
                        <>
                            <input type="text" value={carType} placeholder='Car Model' required className='input' onChange={(e) => { setCarType(e.target.value) }} />
                            <input type="text" value={numberOfSeats} placeholder='Number Of Seats' required className='input' onChange={(e) => { setNumberOfSeats(e.target.value) }} />
                            <input type="text" value={Id} placeholder='ID' required className='input' onChange={(e) => { setId(e.target.value) }} />
                            <input type="text" value={phoneNumber} placeholder='Phone Number' required className='input' onChange={(e) => { setPhoneNumber(e.target.value) }} />
                        </>
                        : ""}
                    {idisabled ? <div className='login-button'>waiting</div> : <button type="submit" className='login-button' disabled={idisabled} onClick={signUp}>Create Acount</button>}
                    <Link to="/signin" className='signup'>Sign In</Link>
                    {/* <button type="submit" className='login-button' disabled={idisabled} onClick={emailSignUp}>Continue with Google</button> */}
                </div>
            </div>
        </div>
    )
}

export default Signup