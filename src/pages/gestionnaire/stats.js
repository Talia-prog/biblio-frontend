import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import axios from "axios";

const Statistiques = () => {
  const [topLivres, setTopLivres] = useState([]);
  const [parMois, setParMois] = useState([]);
  const [nbEmpruntes, setNbEmpruntes] = useState(0);
  const [dispo, setDispo] = useState({ taux: 0, totalLivres: 0, disponibles: 0 });

  useEffect(() => {
    axios.get("${window.env.REACT_APP_API_URL}/api/statistiques/top-livres").then(res => setTopLivres(res.data));
    axios.get("${window.env.REACT_APP_API_URL}/api/statistiques/emprunts-par-mois").then(res => {
      const format = res.data.map(e => ({
        mois: `${e._id.mois}/${e._id.annee}`,
        total: e.total
      }));
      setParMois(format);
    });
    axios.get("${window.env.REACT_APP_API_URL}/api/statistiques/livres-empruntes").then(res => setNbEmpruntes(res.data.total));
    axios.get("${window.env.REACT_APP_API_URL}/api/statistiques/taux-disponibilite").then(res => setDispo(res.data));
  }, []);

  const couleurs = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold text-center">Statistiques d’utilisation</h2>

      {/* Top 5 livres */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">Top 5 des livres les plus empruntés</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topLivres}>
            <XAxis dataKey="titre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Emprunts par mois */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">Nombre d’emprunts par mois</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={parMois}>
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Nombre actuel de livres empruntés */}
      <div className="bg-white p-4 shadow rounded text-center">
        <h3 className="font-semibold mb-2">Livres actuellement empruntés</h3>
        <p className="text-3xl font-bold">{nbEmpruntes}</p>
      </div>

      {/* Taux de disponibilité */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">Taux de disponibilité des livres</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Disponibles", value: dispo.disponibles },
                { name: "Empruntés", value: dispo.totalLivres - dispo.disponibles }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {couleurs.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistiques;