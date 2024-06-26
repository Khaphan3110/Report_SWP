import { useReducer, useState } from "react";
import { UserContext } from "./Context"

function UserProvider ({children}){

    const [ userProfile,setUserProfile ] = useState(null);
    
    return (
      <UserContext.Provider value={ { userProfile,setUserProfile} }>
       { children }
      </UserContext.Provider>
    )
}

export default UserProvider