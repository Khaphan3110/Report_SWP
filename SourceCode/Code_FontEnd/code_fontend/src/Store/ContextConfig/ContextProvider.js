import Context from "./Context";
import { useEffect, useReducer } from "react";
import reducer, { initialState } from "../Reducer/Reducer";

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
}

export default Provider;
