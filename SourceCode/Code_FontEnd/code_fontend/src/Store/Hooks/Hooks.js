import CreateContext from "../ContextConfig/Context";
import { useContext } from "react";

export const useStore = () => {
    const [state,dispatch] = useContext(CreateContext);
    return [state,dispatch]
}