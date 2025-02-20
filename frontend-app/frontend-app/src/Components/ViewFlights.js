import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewFlights() {
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState('');
  const [typeofuser, setTypeOfUser] = useState('');

  // Fetch flight data and user type
  useEffect(() => {
    fetch('http://localhost:9292/flight/all')
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error('Error fetching flight data:', error));

    // Retrieve user type from sessionStorage
    const userType = sessionStorage.getItem("typeofuser");
    setTypeOfUser(userType || 'guest'); // Default to 'guest' if no user type is stored
  }, []);

  // Handle flight deletion
  const handleDelete = (fid) => {
    fetch(`http://localhost:9292/flight/delete/${fid}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(errMessage => {
            throw new Error(errMessage || 'Failed to delete the flight');
          });
        }
        return response.text();
      })
      .then(message => {
        if (message === `Flight with ID ${fid} deleted successfully`) {
          setFlights(flights.filter(flight => flight.fid !== fid));
          setMessage(message);
        } else {
          setMessage(message || 'Unexpected response from server');
        }
      })
      .catch(error => {
        console.error('Error deleting flight:', error);
        setMessage(error.message || 'An error occurred while deleting the flight.');
      });
  };

  return (
    <div>
      <h1>View Flights</h1>

      {message && <p>{String(message)}</p>}

      {flights.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Flight ID (fid)</th>
              <th>Destination</th>
              <th>Company</th>
              <th>Price ($)</th>
              {typeofuser === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.fid}>
                <td>{flight.fid}</td>
                <td>{flight.destination}</td>
                <td>{flight.company}</td>
                <td>{flight.price}</td>
                {typeofuser === 'admin' && (
                  <td>
                    <button
                      onClick={() => handleDelete(flight.fid)}
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading flights...</p>
      )}

      <br />

      {/* Conditional rendering of dashboard links */}
      {typeofuser === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
      {typeofuser === 'user' && <Link to="/customer">Customer Dashboard</Link>}
      {typeofuser === 'guest' && <p>Please log in to access a dashboard.</p>}
    </div>
  );
}

export default ViewFlights;
