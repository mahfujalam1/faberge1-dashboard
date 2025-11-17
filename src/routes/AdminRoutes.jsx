/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  // localStorage থেকে token এবং user পড়া
  const token = localStorage.getItem("token");
  // const userStr = localStorage.getItem("user");
  const userStr = true

  // Token বা user না থাকলে auth route এ redirect
  if (!token || !userStr) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return <Navigate to="/auth/sign-in" replace />;
  }

  // User না থাকলে auth এ redirect
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // সব ঠিক থাকলে route render করবে
  return <>{children}</>;
};

export default AdminRoutes;
