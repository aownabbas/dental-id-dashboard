import { Navigate, useLocation } from "react-router-dom";
const Protected = ({ isLoggedIn, children }) => {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }
  return children;
};
export default Protected;
