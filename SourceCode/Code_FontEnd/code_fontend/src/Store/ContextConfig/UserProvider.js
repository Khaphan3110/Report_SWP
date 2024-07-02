import { useEffect, useState } from "react";
import { UserContext } from "./Context";
import {
  getUserAddAdress,
  getUserInfor,
} from "../../Service/UserService/UserService";

function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState({
    addresses: JSON.parse(localStorage.getItem("userAddresses")) || [],
    CurrentAdress: JSON.parse(localStorage.getItem("userCurrentAddresses")) || {},
    userToken: localStorage.getItem("userToken") || "",
    profile: JSON.parse(localStorage.getItem("userProfile")) || {},
  });

  const addCurrentAddress = (Address) => {
    localStorage.setItem("userCurrentAddresses",JSON.stringify(Address));
    setUserProfile((prevState) => ({
      ...prevState,
      CurrentAdress: Address,
    }));
  };

  const getAllAdressByToken = async (userToken) => {
    try {
      const resAddress = await getUserAddAdress(userToken);
      if (resAddress) {
        const newAddresses = resAddress.data;
        localStorage.setItem("userAddresses",JSON.stringify(newAddresses));
        setUserProfile((prevState) => ({
          ...prevState,
          addresses: [
            ...prevState.addresses,
            ...newAddresses.filter(
              (newAddress) =>
                !prevState.addresses.find(
                  (existingAddress) =>
                    existingAddress.house_Number === newAddress.house_Number &&
                    existingAddress.street_Name === newAddress.street_Name &&
                    existingAddress.district_Name === newAddress.district_Name &&
                    existingAddress.city === newAddress.city &&
                    existingAddress.region === newAddress.region
                )
            ),
          ],
        }));
      }
      return resAddress;
    } catch (error) {
      console.log("loi lay adress user", error);
    }
  };

  const updateUserToken = (token) => {
    localStorage.setItem("userToken", token); // Lưu token vào localStorage
    setUserProfile((prevState) => ({
      ...prevState,
      userToken: token,
    }));
  };

  const getUserProfileByToken = async (userToken) => {
    try {
      const resUserInfor = await getUserInfor(userToken);
      localStorage.setItem("userProfile",JSON.stringify(resUserInfor.data));
      if (resUserInfor) {
        setUserProfile((prevState) => ({
          ...prevState,
          profile: resUserInfor.data,
        }));
      }
      
      return resUserInfor;
    } catch (error) {
      console.log("loi lay profile user", error);
    }
  };

  useEffect(  () => {
    const autoGet = async () => {
      if (userProfile.userToken) {
       const resAddress = await getAllAdressByToken(userProfile.userToken);
        if(resAddress){
        addCurrentAddress(resAddress.data[0])
        }
      }
    }
    autoGet();
  }, [userProfile.userToken]);
  
  const logOut = () => {
    localStorage.clear();
    setUserProfile({
      addresses: [],
      CurrentAdress: "",
      userToken: "",
      profile: {},
    });
  };

  return (
    <UserContext.Provider
      value={{
        logOut,
        userProfile,
        setUserProfile,
        addCurrentAddress,
        getAllAdressByToken,
        updateUserToken,
        getUserProfileByToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
