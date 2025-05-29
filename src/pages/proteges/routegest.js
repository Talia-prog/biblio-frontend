import { Navigate } from "react-router-dom";

const RouteProtégéeGestionnaire = ({ children }) => {
  const gestionnaire = JSON.parse(localStorage.getItem("gestionnaire"));
  return gestionnaire ? children : <Navigate to="/gestionnaire" />;
};

export default RouteProtégéeGestionnaire;