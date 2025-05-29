import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lecteur from "./pages/lecteur/lecteur";
import LoginGestionnaire from "./pages/connexion/connectgest";
import DashboardGestionnaire from "./pages/gestionnaire/dashboardgest";
import GestionLivres from "./pages/gestionnaire/gestion";
import DemandeEmprunts from "./pages/gestionnaire/demande";
import EmpruntsEnCours from "./pages/gestionnaire/encours";
import HistoriqueEmprunts from "./pages/gestionnaire/historique";
import Statistiques from "./pages/gestionnaire/stats";
import {Link} from "react-router-dom";
import ChoixUtilisateur from "./pages/connexion/choix";
import InscriptionLecteur from "./pages/connexion/inscriptionlecteur";
import ConnexionLecteur from "./pages/connexion/connectlecteur";
import ForgotPasswordGestionnaire from "./pages/connexion/forgotpasswordgest";
import resetGest from "./pages/connexion/resetgest";
import forgotlecteur from "./pages/connexion/forgotlecteur";
import resetlecteur from "./pages/connexion/resetlecteur";
import RouteProtégéeLecteur from "./pages/proteges/routelec";
import RouteProtégéeGestionnaire from "./pages/proteges/routegest";
/*const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/lecteurs', require('./routes/lecteurs'));
app.use('/api/gestionnaires', require('./routes/gestionnaires'));

// Reste de votre code...

module.exports = app;*/

function App() {
  return (
    <Router>
      <>
      <nav>
        {/* <Link to="/pagelecteur">lecteur</Link> |{" "}
        <Link to="/gestionnaire">connexion</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/">accueil</Link>  */}
      </nav>
      <Routes>
        <Route path="/" element={<ChoixUtilisateur />} />
        <Route path="/pagelecteur" element={<RouteProtégéeLecteur><Lecteur /></RouteProtégéeLecteur>} />
        <Route path="/connexion-lecteur" element={<InscriptionLecteur />} />
        <Route path="/lecteur/connexion" element={<ConnexionLecteur />} />
        <Route path="/gestionnaire/mot-de-passe-oublie" element={<ForgotPasswordGestionnaire />} />
        <Route path="/reset-password/:token" element={<resetGest />} />
        <Route path="/motdepasse-oublie-lecteur" element={<forgotlecteur />} />
        <Route path="/reset-passwordlecteur/:token" element={<resetlecteur />} />
        <Route path="/gestionnaire" element={<LoginGestionnaire />} />
        <Route path="/dashboard" element={<RouteProtégéeGestionnaire><DashboardGestionnaire /></RouteProtégéeGestionnaire>} />
        <Route path="/gestionnaire/livres" element={<GestionLivres/>}/>
        <Route path="/gestionnaire/demandes" element={<DemandeEmprunts/>}/>
        <Route path="/gestionnaire/emprunts-en-cours" element={<EmpruntsEnCours/>}/>
        <Route path="/gestionnaire/historique" element={<HistoriqueEmprunts/>}/>
        <Route path="/gestionnaire/statistiques" element={<Statistiques/>}/>

      </Routes>
      </>
    </Router>
    
  );
}

export default App;