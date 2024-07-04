import React from 'react'
import { useAdminProfile } from '../../../Store'
import { Navigate } from 'react-router-dom';

export default function ProtectStaff({children}) {
    const {StaffProfile} = useAdminProfile();
    if(!StaffProfile.profileAdmin){
        return <Navigate to="/loginadmin" />;
    }
  return children
}
