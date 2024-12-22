// This file is used to ensure that users will be able to visit certain pages only if they are authenticated.

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not authenticated
  }

  return <>{children}</>;
};

export default PrivateRoute;
