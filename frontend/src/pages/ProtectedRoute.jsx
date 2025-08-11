import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user === undefined) {
    return <div>Bekleniyor...</div>;
  }

  // Kullanıcı yoksa login sayfasına
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
