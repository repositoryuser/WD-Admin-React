import React from 'react'
import { Routes, Route } from "react-router-dom";
import LoginPage from '../components/loginPage/Login';


const AuthRoutes = () => {
  return (
    <React.Fragment>
            <Routes>
            <Route path="*" element={<LoginPage/>} />
            </Routes>
   </React.Fragment>
  )
}

export default AuthRoutes