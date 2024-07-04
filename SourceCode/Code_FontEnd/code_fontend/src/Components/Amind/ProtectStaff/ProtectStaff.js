import React from 'react'
import { useAdminProfile } from '../../../Store'
import { Navigate } from 'react-router-dom';

export function ProtectStaff({children}) {
    const {StaffProfile} = useAdminProfile();
    if(!StaffProfile.profileAdmin.role === 'staffadmin'){
        return <Navigate to="/loginadmin" />;
    }
  return children
}


export function ProtectStaffRole({children}) {
  const {StaffProfile} = useAdminProfile();
  if(!StaffProfile.profileAdmin.role === 'staffadmin'){
      return <Navigate to="/loginadmin" />;
  }
return children
}
