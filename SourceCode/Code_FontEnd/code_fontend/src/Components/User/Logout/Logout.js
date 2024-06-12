import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    const navigator = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigator("/login")
    },[navigator])
  return null;
}
