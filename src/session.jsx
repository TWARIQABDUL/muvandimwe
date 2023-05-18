import { onAuthStateChanged, updateCurrentUser, updateProfile } from "@firebase/auth";
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
            //   console.log("No such document!");
              return null;
            }
          }
          
          const CheckUser = () => {
            onAuthStateChanged(auth, async (user) => {
              if (user == null) {
                navigate('/signin')
              } else {
                const names = await getDocumentById(user.uid);
                // console.log(names.name);
                if (names && names.name) {
                  try {
                    await updateProfile(auth.currentUser, { displayName: names.name });
                    // console.log("User display name updated!");
                  } catch (error) {
                    console.log("Error updating user display name:", error);
                  }
                }
                setLoading(false);
                setSession(user);
                navigate('/');
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