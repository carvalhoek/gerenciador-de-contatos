import React, { useState } from "react";
import SimpleInput from "../components/SimpleInput";
import PasswordInput from "../components/PasswordInput";
import ConfirmButton from "../components/ConfirmButton";
import { Link } from "react-router-dom";

function AuthForm({ mode, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { email, password };
    if (mode === "register") payload.name = name;
    onSubmit(payload);
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl">
        {mode === "login" ? "Entrar" : "Cadastrar"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-center">
        {mode === "register" && (
          <SimpleInput
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <SimpleInput
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <Link
            to={mode === "login" ? "/register" : "/login"}
            className="text-sm text-slate-600 hover:underline"
          >
            {mode === "login" ? "Criar conta" : "Já tenho conta"}
          </Link>
          <ConfirmButton type="submit">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </ConfirmButton>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
