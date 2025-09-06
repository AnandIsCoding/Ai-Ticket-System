import React from 'react'
import { Navigate } from 'react-router-dom'

function CheckAdmin({isAdmin, children}) {
  if(!isAdmin){
    return <Navigate to='/' replace />
  }
  return children
}

export default CheckAdmin
