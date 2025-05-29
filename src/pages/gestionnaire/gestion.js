import React, { useState } from "react";
import "./gestion.css";

function GestionLivres() {
  const [rubriques] = useState(["Roman", "Conte", "Informatique", "Philosophie", "Science"]);
  const [livres, setLivres] = useState([]);
  const [nouveauLivre, setNouveauLivre] = useState({
    titre: "",
    auteur: "",
    rubrique: rubriques[0],
    annee: "",
    disponible: true
  });

  const handleAdd = () => {
    if (!nouveauLivre.titre || !nouveauLivre.auteur || !nouveauLivre.annee) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    setLivres([...livres, { ...nouveauLivre, id: Date.now() }]);
    setNouveauLivre({ titre: "", auteur: "", rubrique: rubriques[0], annee: "", disponible: true });
  };

  return (
    <div className="page-gestion">
      <h2>Ajouter un nouveau livre</h2>
      <div className="form-ligne">
        <input placeholder="Titre" value={nouveauLivre.titre} onChange={(e) => setNouveauLivre({ ...nouveauLivre, titre: e.target.value })} />
        <input placeholder="Auteur" value={nouveauLivre.auteur} onChange={(e) => setNouveauLivre({ ...nouveauLivre, auteur: e.target.value })} />
        <input placeholder="Année" value={nouveauLivre.annee} onChange={(e) => setNouveauLivre({ ...nouveauLivre, annee: e.target.value })} />
        <select value={nouveauLivre.rubrique} onChange={(e) => setNouveauLivre({ ...nouveauLivre, rubrique: e.target.value })}>
          {rubriques.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Ajouter</button>
      </div>

      <h2>Liste des livres</h2>
      <ul className="liste">
        {livres.map((livre) => (
          <li key={livre.id}>
            <span><strong>{livre.titre}</strong> - {livre.auteur} ({livre.rubrique}, {livre.annee})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionLivres;