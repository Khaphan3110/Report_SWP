import { CreateContext } from "./Context";
import { useEffect, useReducer } from "react";
import reducer, { initialState } from "../Reducer/Reducer";

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CreateContext.Provider value={[state, dispatch]}>{children}</CreateContext.Provider>
  );
}

export default Provider;
