import React from 'react'
import axios from "../customAxios/CustomAxios";
export default function UserCodeFromEmail() {
  return axios.post(`/api/Users/ConfirmEmail?token=123456&email=haphong2907%40gmail.com`)
}
