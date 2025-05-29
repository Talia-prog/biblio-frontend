// components/GestionnaireLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import Logo from "../logo";
function GestionnaireLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [error, setError] = useState('');
const navigate = useNavigate();
  const MAX_TENTATIVES = 3;
const DUREE_BLOCAGE = 15 * 60 * 1000; // 15 minutes en ms

const handleLogin = async (e) => {
  e.preventDefault();

  const blocage = JSON.parse(localStorage.getItem("blocage"));
  const maintenant = Date.now();

  if (blocage && maintenant < blocage.finBlocage) {
    const minutesRestantes = Math.ceil((blocage.finBlocage - maintenant) / 60000);
    alert(`Connexion bloquée. Réessayez dans ${minutesRestantes} minute(s).`);
    return;
  }

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/gestionnaire/login`, {
      email,
      motdepasse,
    });

    alert(res.data.message);
    localStorage.setItem("gestionnaire", JSON.stringify(res.data.gestionnaire));
    localStorage.removeItem("blocage");
    navigate("/dashboard");

  } catch (err) {
    let tentatives = Number(localStorage.getItem("tentatives")) || 0;
    tentatives += 1;

    if (tentatives >= MAX_TENTATIVES) {
      const finBlocage = Date.now() + DUREE_BLOCAGE;
      localStorage.setItem("blocage", JSON.stringify({ finBlocage }));
      localStorage.removeItem("tentatives");
      alert("Trop de tentatives. Connexion bloquée pendant 15 minutes.");
    } else {
      localStorage.setItem("tentatives", tentatives);
      alert("Identifiants incorrects. Tentative " + tentatives + "/" + MAX_TENTATIVES);
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <div className="w-24 h-24 mb-4 bg-white border rounded-lg mx-auto">
              <Logo size={100} />
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Connexion à OpenShelf BEAC</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={motdepasse}
            onChange={(e) => setMotdepasse(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 transition"
        >
          Se connecter
        </button>
        <div className='text-right mt-2'>
          <Link to="/gestionnaire/mot-de-passe-oublie" className='text-sm text-blue-600 hover:underline'>
          mot de passe oublié?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default GestionnaireLogin;