import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext.jsx";

// Protected route component that redirects to login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route's children
  return children;
};

export default ProtectedRoute;
