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
    <div
      className="card"
      style={{
        backgroundColor: '#4CAF50',
        color: '#fff',
        width: '100%',
        margin: '0',
        textAlign: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        borderRadius: '12px'
      }}
    >
      <div
        className="card-header"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Capital Disponible</h3>
      </div>
      <p style={{ fontSize: '36px', marginTop: '1rem' }}>{`$${parseFloat(capital).toLocaleString()} USD`}</p>
    </div>

  );
};

export default CapitalDisponibleCard;
