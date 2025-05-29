import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const ExportEmprunts = () => {
  const [showDates, setShowDates] = useState(false);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");

  const handleExport = async () => {
  if (!debut || !fin) {
    alert("Veuillez sélectionner une période.");
    return;
  }

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/emprunts/export`,{
        params:{
            debut:debut,
            fin:fin
        },
    });

    const emprunts = res.data;
    const doc=new jsPDF();
    doc.setFont("cg times", "normal");

    doc.text(`Historique des emprunts du ${debut} au ${fin}`, 14, 15);

    const rows = emprunts.map((Emprunt, index) => ([

      Emprunt.idLivre?.titre || "",
      Emprunt.nom || "",
      new Date(Emprunt.dateemprunt).toLocaleDateString() || "",
      new Date(Emprunt.dateretour).toLocaleDateString() ||""
    ]));

    doc.autoTable({
      startY: 20,
      head: [["Titre","Lecteur","date Emprunt","date Retour"]],
      body: rows,
      styles: {
        fontSize: 9,
        font: "Cg times",
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
      },
    });

    doc.save(`Historique emprunts du ${debut} au ${fin}`);
  } catch (err) {
    console.error("Erreur export catalogue :", err);
    alert("Erreur lors de l'exportation.");
  }
};

  return (
    <div className="p-4">
      {!showDates ? (
        <button
          onClick={() => setShowDates(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded"
        >
          Exporter l’historique
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Télécharger PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportEmprunts;