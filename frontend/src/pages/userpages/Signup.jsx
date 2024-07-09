import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux"
import { userSignup} from "../../features/thunk"
import Username from "../../components/Username";
import Email from "../../components/Email";
import Password from "../../components/Password";
import Navbar from "../../components/Navbar";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordState, setPasswordState] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)


  const handleUserSignup = async() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmailPattern = emailRegex.test(email);
    const passwordPattern = /^[^\s]{6,}$/;
    const validPassword = passwordPattern.test(password)
    
    if (!email.trim() || !password.trim() || !validEmailPattern || !validPassword) {
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
        const resultAction = await  dispatch(userSignup({ userName, email, password })).unwrap()
        if (resultAction.success) {
          history.push('/home'); 
        }
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
        <div className="relative inline-block text-left">
          
        </div>
      </div>
    </div>
   {/* ==================================================== */}
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
        <form className="space-y-6">
          <h5 className="text-xl text-center font-medium text-gray-900">
            Sign Up
          </h5>
          {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
          <Username userName={userName} setUserName={setUserName} />
          <Email email={email} setEmail={setEmail} emailState={emailState} />
          <Password
            password={password}
            setPassword={setPassword}
            passwordState={passwordState}
          />
          <p className="text-xs">password should contain atleast 6 characters</p>
          <div className="flex justify-center text-sm font-medium text-gray-500">
            Already have an account?
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/home");
              }}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              Sign In
            </a>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUserSignup();
            }}
            type="submit"
            className="w-full text-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default Signup;
