import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { loginUser } from "../utils/auth";
function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    try {
      loginUser({ email, password });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-slate-200 h-screen w-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-[500px] text-center">
        <AuthForm mode="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
}
export default LoginPage;
