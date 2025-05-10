import { useState, useEffect } from "react";
import TransportstyrelsenLogo from "../assets/TransportstyrelsenLogo.png";

export default function VehicleForm() {
  const [plate, setPlate] = useState("");
  const [kundId, setKundId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [vehicleType, setVehicleType] = useState("Personbil");
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  
  useEffect(() => {
    if (ownerName.length >= 2) {
      fetch(`${API}/clienti?search=${ownerName}`)
        .then((res) => res.json())
        .then((data) => setOwnerSuggestions(data));
    } else {
      setOwnerSuggestions([]);
    }
  }, [ownerName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      registreringsnummer: plate,
      kund_id: kundId,
      besiktningsdatum: inspectionDate,
      fordonstyp: vehicleType,
    };

    fetch("http://sts-orebro.onrender.com/veicoli", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
    
      .then((res) => {
        if (!res.ok) throw new Error("Fel vid sparning av fordon");
        alert("Fordon sparat");
        setPlate("");
        setKundId("");
        setOwnerName("");
        setInspectionDate("");
        setVehicleType("Personbil");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Lägg till nytt fordon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Registreringsnummer</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            />
            <button
              type="button"
              onClick={() =>
                window.open(
                  `https://fordon-fu-regnr.transportstyrelsen.se/`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="mt-1 p-2 bg-gray-100 border rounded hover:bg-blue-100"
              title="Sök uppgifter på Transportstyrelsen"
            >
              <img
                src={TransportstyrelsenLogo}
                alt="Transportstyrelsen"
                className="h-6 w-auto"
              />
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold">Besiktningsdatum</label>
          <input
            type="date"
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Fordonstyp</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          >
            <option value="Lastbil">Lastbil</option>
            <option value="Trailer">Trailer</option>
            <option value="Släp">Släp</option>
            <option value="Dolly">Dolly</option>
            <option value="Skåp">Skåp</option>
            <option value="Lätt lastbil">Lätt lastbil</option>
            <option value="Personbil">Personbil</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Kund ID</label>
          <input
            type="text"
            value={kundId}
            onChange={(e) => setKundId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="Ange kund-ID eller välj ägarnamn"
          />
        </div>

        <div>
          <label className="block font-semibold">Användare</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="Vid hyrfordon, ange ett användarnamn"
          />

          {ownerSuggestions.length > 0 && (
            <ul className="border border-gray-300 mt-2 rounded bg-white max-h-40 overflow-y-auto">
              {ownerSuggestions.map((owner) => (
                <li
                  key={owner.kund_id}
                  onClick={() => {
                    setKundId(owner.kund_id);
                    setOwnerName(owner.nominativo);
                    setOwnerSuggestions([]);
                  }}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                >
                  {owner.nominativo} (ID: {owner.kund_id})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Spara fordonet
        </button>
      </form>
    </div>
  );
}
