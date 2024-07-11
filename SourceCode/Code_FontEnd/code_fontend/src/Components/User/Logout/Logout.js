import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../../Store';

export default function Logout() {
    const navigator = useNavigate();
    const { logOut } = useUserProfile()
    useEffect(() => {
       logOut();
        localStorage.clear();
        navigator("/login")
    },[])
  return null;
}
