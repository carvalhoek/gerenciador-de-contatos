import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Contacts from "./pages/Contacts.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // Colocar a pagina Contacts como filha faz com se torne mais fácil a expansão do projeto em caso de necessidade de mais telas
    children: [{ index: true, element: <Contacts /> }],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
