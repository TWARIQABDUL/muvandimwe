import { onAuthStateChanged,updateProfile } from "@firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "@firebase/firestore";
export const SessionContext = createContext(null);
export const SessionProvider = ({ children }) => {
    const [session, steSes] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const setSession = (value) => {
        steSes(value)
    }
    const navigate = useNavigate()

    useEffect(() => {
        async function getDocumentById(id) {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id: docSnap.id, ...docSnap.data() };
            } else {
              return null;
            }
          }
          
          const CheckUser = () => {
            onAuthStateChanged(auth, async (user) => {
              if (user == null) {
                navigate('/signin')
              }else{
                getDocumentById(user.uid)
                .then(names =>{
                  if (names && names.name) {
                    try {
                      updateProfile(auth.currentUser, { displayName: names.name })
                      .then()
                      .catch(err =>{
                        console.log("fucked too");
                      })
                    } catch (error) {
                      console.log("fails",error);
                    }
                  }
                  setSession(user);
                  setLoading(false);
                }).catch(err=>{
                  setLoading(false);
                })
              }

            })
          }
          
          CheckUser();
          

    }, [])
    return (
        <SessionContext.Provider value={{ session, setSession, isLoading }}>
            {children}
        </SessionContext.Provider>
    )
}
// export default SessionContext