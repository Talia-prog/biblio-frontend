import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

function EmpruntsEnCours({ nom, poste }) { 
    const [emprunts, setEmprunts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

useEffect(() => { 
    const fetchEmprunts = async () => { 
        try { 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/emprunts/lecteur`, { nom, poste }); 
            setEmprunts(response.data); 
        } catch (err) { 
            console.error('Erreur récupération emprunts :', err); 
            setError('Impossible de récupérer les emprunts.'); 
        } finally { 
            setLoading(false); 
        } };

if (nom && poste) {
  fetchEmprunts();
} else {
  setLoading(false);
}

}, [nom, poste]);

if (loading) 
    return <p>Chargement des emprunts...</p>; 
if (error) 
    return <p className="text-red-500">{error}</p>;

if (emprunts.length === 0) { 
    return <p>Aucun emprunt en cours.</p>; 
}

return ( 
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
    {emprunts.map((e, index) => { 
        const titrelivre= e.idLivre?.titre;
        const dateDebut = new Date(e.dateemprunt); 
        const datePrevue = new Date(dateDebut); 
        datePrevue.setDate(dateDebut.getDate() + (e.duree || 0));

return (
      <div
        key={index}
        className="bg-pink-100 rounded-xl p-4 shadow-md w-[350px] h-[150px]"
      >
        <h3 className="text-lg font-semibold mb-2">
          {titrelivre}
        </h3>
        <p className="text-sm text-pink-700 mb-1">
          Début : {dateDebut.toLocaleDateString()}
        </p>
        <p className="text-sm text-pink-700">
          Retour prévu : {datePrevue.toLocaleDateString()}
        </p>
      </div>
    );
  })}
</div>

); }

export default EmpruntsEnCours;