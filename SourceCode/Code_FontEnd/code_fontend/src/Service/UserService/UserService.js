import axios from "../customAxios/CustomAxios";

//Register user
const userRegister = (
  FirstName,
  LastName,
  Email,
  PhoneNumber,
  UserName,
  Password,
  ConfirmPassword
) => {
  return axios.post("/api/Users/register", {
    FirstName,
    LastName,
    Email,
    PhoneNumber,
    UserName,
    Password,
    ConfirmPassword,
  });
};

//user login
const userLogin = () => {
  return axios.post("/api/Users/authenticate", {
    UserName:"haphong",
    Password:"Aa@12345",
    RememberMe: "true",
  });
};

export { userRegister, userLogin };
