// src/App.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logoutUser } from "./utils/auth";
import { useNavigate } from "react-router-dom";
import HeaderButton from "./components/HeaderButton";
import AccountCard from "./components/AccountCard";

function App() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Gerenciador de contatos</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">
            Contatos
          </Link>
          <AccountCard handleLogout={handleLogout} />
        </nav>
      </header>

      {/* Conteúdo específico de cada rota */}
      <main className="flex-1 p-6 bg-slate-100">
        <Outlet />
      </main>

      {/* Rodapé opcional */}
      <footer className="bg-gray-200 text-center p-4">
        © 2025 Duna Solutions
      </footer>
    </div>
  );
}
export default App;
