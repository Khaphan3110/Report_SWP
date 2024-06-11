
import axios from "axios";

 const instance = axios.create({
  baseURL: "https://localhost:44358/api/",
});

export const Post = ( path,param = {},header = {}) => {
     const res = instance.post(path,param,header);
     return res
}

export const Get = ( path,param = {},header = {}) => {
  const res = instance.get(path,param,header);
  return res
}




// axios.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response.data;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

export default instance;
