import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Contacts from "./pages/Contacts.jsx";
import RequireAuth from "./utils/RequireAuth.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // Todas as paginas do app serão protegidas pelo RequireAuth
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    // Colocar as paginas como filhas faz com se torne mais fácil a expansão
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
