import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Email from "../../components/Email";
import Password from "../../components/Password";
import Navbar from "../../components/Navbar";
import { userLogin } from "../../features/thunk";

function UserLog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordState, setPasswordState] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUserLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmailPattern = emailRegex.test(email);
    const passwordPattern = /^[^\s]{6,}$/;
    const validPassword = passwordPattern.test(password);
    if (
      !email.trim() ||
      !password.trim() ||
      !validEmailPattern ||
      !validPassword
    ) {
      if (!email.trim() || !validEmailPattern) {
        setEmailState(true);
        setTimeout(() => {
          setEmailState(false);
        }, 3000);
      }
      if (!password.trim() || !validPassword) {
        setPasswordState(true);
        setTimeout(() => {
          setPasswordState(false);
        }, 3000);
      }
    } else {
      try {
        dispatch(userLogin({ email, password, navigate })).unwrap();
        // if (resultAction.success) {
        //   history.push('/home');
        // }
      } catch (error) {
        setErrorMessage(error);
      }
    }
  };

  return (
    <>
      <div className="flex w-full bg-white shadow h-16 items-center">
        <div className="flex justify-center w-full ">
          <h1 className="text-3xl font-bold">User App</h1>
        </div>
        <div className="flex justify-end pe-7">
          <div className="relative inline-block text-left"></div>
        </div>
      </div>
      {/* ==================================================== */}
      <div className="h-screen flex justify-center items-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
          <form className="space-y-6">
            <h5 className="text-xl text-center font-medium text-gray-900">
              Sign In
            </h5>
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}
            <Email email={email} setEmail={setEmail} emailState={emailState} />
            <Password
              password={password}
              setPassword={setPassword}
              passwordState={passwordState}
            />
            <div className="flex justify-center text-sm font-medium text-gray-500">
              Not registered?
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/sign-up");
                }}
                className="text-blue-700 hover:underline cursor-pointer"
              >
                Create account
              </a>
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleUserLogin();
              }}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login to your account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserLog;
