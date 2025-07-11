import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/slices/authSlice";
import axios from "axios";
import Cookies from "js-cookie";

const Form: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setErrMsg] = useState("");
  const accessKey = import.meta.env.VITE_REACT_ADMIN_ACCESS_KEY;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios
        .post("admin/signin", {
          email: email,
          password: password,
        })
        .then((res) => {
          Cookies.set("accessKey", accessKey, { expires: 1 });
          dispatch(login());
          navigate("/dashboard");
          console.log(res.data.message);
        })
        .catch((err: any) => {
          setErrMsg(err.response.data.message);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full lg:w-1/2 h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h2 className="text-center text-2xl font-bold text-brown-700">Admin</h2>
        <div className="w-20 border-t-2 border-brown-700 mx-auto my-4" />
        <p className="mb-3 text-center font-semibold text-sm text-red-700">
          {message}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full p-3 bg-brown-700 text-white font-semibold rounded-lg">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
