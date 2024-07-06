import React from 'react'
import { useUserProfile } from '../../../Store'
import { useNavigate } from 'react-router-dom';

export default function ProtectUser({children}) {
    const { userProfile } = useUserProfile();
    const navigator = useNavigate()
    if(!userProfile){
        navigator("/login")
    }
  return (
    {children}
  )
}
