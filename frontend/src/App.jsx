
import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "./constants/constant";
import { setUser } from './features/userSlice';
import { setAdmin } from "./features/adminSlice"; 
import Login from "./pages/adminPages/Login";
import Home from "./pages/userpages/Home";
import Signup from "./pages/userpages/Signup";
import Profile from "./pages/userpages/Profile";
import UserLog from "./pages/userpages/UserLog";
import Dashboard from "./pages/adminPages/Dashboard";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);

  useLayoutEffect(() => {
    if (!user.isAuthenticated) {
      axios
        .get(`${BACKEND_BASE_URL}/check-auth`, {
          withCredentials: true,
        })
        .then((res) => {
          const response = res.data;
          if (response.success) {
            dispatch(
              setUser({
                userId: response?.userData?._id,
                name: response?.userData?.userName,
                isAuthenticated: true,
              })
            );
          }
        })
        .catch((err) => {
          console.error('Error checking user auth:', err);
        });
    }
    if (!admin.isAuthenticated) {
      axios
        .get(`${BACKEND_BASE_URL}/admin/check-auth`, {
          withCredentials: true,
        })
        .then((res) => {
          const response = res.data;
          if (response.success) {
            dispatch(
              setAdmin({
                adminId: response?.adminData?._id,
                email: response?.adminData?.email,
                isAuthenticated: true,
              })
            );
          }
        })
        .catch((err) => {
          console.error('Error checking admin auth:', err);
        });
    }
  }, [dispatch]);

  return (
    <Routes>
    {user.isAuthenticated ? (
      <>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<Navigate to="/home" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<Navigate to="/home" />} />
        {/* <Route path="*" element={<Navigate to="/home" />} /> */}
       
      </>
    ) : (
      <>
        <Route path="/" element={<UserLog />} />
        <Route path="/home" element={<UserLog />} />
        <Route path="/profile" element={<UserLog />} />
        <Route path="/sign-up" element={<Signup />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </>
    )}
    
    {admin.isAuthenticated ? (
      <>
        <Route path="/admin/adminlogin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      
      </>
    ) : (
      <>
        <Route path="/admin/adminlogin" element={<Login />} />
        {/* <Route path="/admin/dashboard" element={<Navigate to="/admin/adminlogin" />} /> */}
        <Route path="*" element={<Login />} />
      
      </>
    )}
  </Routes>
  );
}

export default App;
