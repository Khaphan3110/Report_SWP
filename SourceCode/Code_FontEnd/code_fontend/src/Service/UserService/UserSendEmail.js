import React from "react";
import axios from "../customAxios/CustomAxios";
export default function UserSendEmail(propUserEmail) {
  return axios.post(`/api/Users?email=${propUserEmail}`);
}
