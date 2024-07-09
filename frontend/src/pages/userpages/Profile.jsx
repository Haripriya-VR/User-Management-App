
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { BACKEND_BASE_URL } from "../../constants/constant";
import EditProfile from "../../components/modal/EditProfile";

function Profile() {
  const dispatch = useDispatch();
  const [updateProfileModalIsOpen, setUpdateProfileModalIsOpen] = useState(false);
  const userId = useSelector((state) => state.user?.userId);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${BACKEND_BASE_URL}/profile/${userId}`, {
          withCredentials: true,
        })
        .then((res) => {
          const response = res.data;
          if (response.success) {
            setUserData(response.userData);
            console.log(response.userData, 'userData');
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  const handleUpdateProfile = () => {
    setUpdateProfileModalIsOpen(!updateProfileModalIsOpen);
  };

  const profilePhotoUrl = userData?.profilephoto 
  ? `${BACKEND_BASE_URL}/uploads/${userData.profilephoto}`
  : "/images/profile.jpg";

  console.log("Profile photo URL:", profilePhotoUrl);


  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="flex shadow w-1/2 mt-5 h-40">
          <div className="bg-white w-40 border-r border-black">
          <img
              src={profilePhotoUrl}
              className="object-cover h-40 w-40"
              alt="Profile"
            />
         
            <button
              onClick={handleUpdateProfile}
              className="font-bold absolute border mt-4 p-2 bg-slate-100"
            >
              Edit profile
            </button>
          </div>
          <div className="p-3 grid lg:grid-cols-1">
            <p className="font-bold">Name: {userData?.userName}</p>
            <p className="font-bold">Email: {userData?.email}</p>
          </div>
        </div>
      </div>
      <EditProfile
        userId={userData?._id}
        userNameToUpdate={userData?.userName}
        emailToUpdate={userData?.email}
        imageToUpdate={userData?.profilephoto}
        isModalOpen={updateProfileModalIsOpen}
        setIsModalOpen={setUpdateProfileModalIsOpen}
      />
    </>
  );
}

export default Profile;

