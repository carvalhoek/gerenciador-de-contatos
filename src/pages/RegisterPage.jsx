import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { registerUser } from "../utils/auth";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = ({ name, email, password }) => {
    try {
      registerUser({ name, email, password });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-slate-200 h-screen w-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-[500px] text-center">
        <AuthForm mode="register" onSubmit={handleRegister} />
      </div>
    </div>
  );
}
export default RegisterPage;
