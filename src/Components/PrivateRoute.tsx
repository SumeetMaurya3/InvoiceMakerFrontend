import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = Cookies.get("access_token"); // Check for access token in cookies

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
