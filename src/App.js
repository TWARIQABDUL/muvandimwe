import { useContext} from "react";
import {SessionContext }from "./session";
import Home from "./components/home";
import Loading from "./components/loadinf";
import { collection} from "@firebase/firestore";
import { db } from "./firebase";
import Driverhome from "./drivercomponents/driverhome";
function App() {
  const {isLoading} = useContext(SessionContext)
  const {session,userInfo} = useContext(SessionContext)
  // const userCollectionRef = collection(db,"users")
  if (isLoading) {
    return <Loading/>
  }
  return(
    <div className="main">
      {/* <Testreq/> */}
      {userInfo.category == "driver" ? <Driverhome/> : <Home/>}
      {/* <Home/> */}
      {/* <p>hello {session}</p>
    <button type="submit" onClick={logOut}>out</button> */}
    </div>
    
    
  )
}

export default App;
