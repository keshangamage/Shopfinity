import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
