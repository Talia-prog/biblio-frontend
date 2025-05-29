import React from "react";
import { useNavigate } from "react-router-dom";

function ChoixUtilisateur() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Bienvenue !</h1>
        <p className="mb-6 text-gray-600">Veuillez sélectionner votre profil</p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/connexion-lecteur")}
            className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Lecteur
          </button>
          <button
            onClick={() => navigate("/gestionnaire")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Gestionnaire
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChoixUtilisateur;