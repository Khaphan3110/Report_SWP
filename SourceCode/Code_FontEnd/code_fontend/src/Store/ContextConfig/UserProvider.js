import { useEffect, useState } from "react";
import { UserContext } from "./Context";
import {
  getUserAddAdress,
  getUserInfor,
} from "../../Service/UserService/UserService";

function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState({
    addresses: [],
    CurrentAdress: {},
    userToken: localStorage.getItem("userToken") || "",
    profile: {},
  });

  const addCurrentAddress = (Address) => {
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
      if (resUserInfor) {
        setUserProfile((prevState) => ({
          ...prevState,
          profile: resUserInfor.data.member,
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
        await getUserProfileByToken(userProfile.userToken);
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
