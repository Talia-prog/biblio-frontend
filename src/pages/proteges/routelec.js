import { Navigate } from "react-router-dom";

const RouteProtégéeLecteur = ({ children }) => {
  const lecteur = JSON.parse(localStorage.getItem("lecteurConnecte"));
  return lecteur ? children : <Navigate to="/connexion-lecteur" />;
};

export default RouteProtégéeLecteur;