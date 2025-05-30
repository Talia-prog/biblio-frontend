import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../logo";
function ConnexionLecteur() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const navigate = useNavigate();

const MAX_TENTATIVES = 3;
const DUREE_BLOCAGE = 15 * 60 * 1000; // 15 minutes en ms

const handleLogin = async (e) => {
  e.preventDefault();

  const blocage = JSON.parse(localStorage.getItem("blocageConnexion"));
  const maintenant = Date.now();

  if (blocage && maintenant < blocage.finBlocage) {
    const minutesRestantes = Math.ceil((blocage.finBlocage - maintenant) / 60000);
    alert(`Connexion bloquée. Réessayez dans ${minutesRestantes} minute(s).`);
    return;
  }

  try {
    const res = await axios.post(`${window.env.REACT_APP_API_URL}/api/lecteurs/login`, {
      email,
      motdepasse,
    });

    alert(res.data.message);
    localStorage.setItem("lecteurConnecte", JSON.stringify(res.data.lecteur));
    localStorage.removeItem("blocageConnexion");
    navigate("/pagelecteur");

  } catch (err) {
    let tentatives = Number(localStorage.getItem("tentativesConnexion")) || 0;
    tentatives += 1;

    if (tentatives >= MAX_TENTATIVES) {
      const finBlocage = Date.now() + DUREE_BLOCAGE;
      localStorage.setItem("blocageConnexion", JSON.stringify({ finBlocage }));
      localStorage.removeItem("tentativesConnexion");
      alert("Trop de tentatives. Connexion bloquée pendant 15 minutes.");
    } else {
      localStorage.setItem("tentativesConnexion", tentatives);
      alert("Identifiants incorrects. Tentative " + tentatives + "/" + MAX_TENTATIVES);
    }
  }
};  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
       <div className="w-24 h-24 mb-4 bg-white border rounded-lg mx-auto">
      <Logo size={100} />
    </div>
    <h2 className="text-2xl font-semibold mb-6 text-center">Connexion à OpenShelf BEAC</h2>

      
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Adresse e-mail"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Se connecter
        </button>
        <p class="text-sm mt-2">
  <a href="/motdepasse-oublie-lecteur" class="text-blue-600 hover:underline">Mot de passe oublié ?</a>
</p>
        <p className="text-sm text-center">
          Pas encore de compte ? <Link to="/connexion-lecteur" className="text-blue-600 underline">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}

export default ConnexionLecteur;