import React, { useEffect, useState } from "react";

const CapitalDisponibleCard = () => {
  const [capital, setCapital] = useState(null);

  // Fetching data from the API
  useEffect(() => {
    const fetchCapital = async () => {
      try {
        const response = await fetch("http://localhost:5000/capital/");
        const data = await response.json();
        if (data && data.length > 0) {
          setCapital(data[0].monto); // Assuming data[0] contains the capital object
        }
      } catch (error) {
        console.error("Error fetching capital:", error);
      }
    };

    fetchCapital();
  }, []);

  if (capital === null) {
    return <div>Loading...</div>; // You can show a loader while data is being fetched
  }

  return (
    <div className="card" style={{ backgroundColor: '#4CAF50', color: '#fff', width:'32%', height:'180px',  margin: '0 auto' }}>
      <div   className="card-header">
        <h3>Capital Disponible</h3>
      </div>
        <p style={{ fontSize:'30px' }}>{`$${parseFloat(capital).toLocaleString()} USD`}</p>
    </div>
  );
};

export default CapitalDisponibleCard;
