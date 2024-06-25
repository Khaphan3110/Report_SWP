import { useReducer } from "react";
import { UserContext } from "./Context"

function UserProvider ({children}){

    const [state, dispatch] = useReducer();
    return (
      <UserContext.Provider value={ [state,dispatch] }>
       { children }
      </UserContext.Provider>
    )
}

export default UserProvider