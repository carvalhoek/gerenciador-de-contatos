import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/AuthService";

export default function RequireAuth({ children }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
