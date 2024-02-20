// JavaScript code to fetch data and display it
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/api/reservations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        const reservationList = document.getElementById('reservation-list');
        const reservations = data.reservations; // Access the reservations array
        if (Array.isArray(reservations)) {
          reservations.forEach(reservation => {
            const reservationDiv = document.createElement('div');
            reservationDiv.classList.add('reservation');
            reservationDiv.innerHTML = `
              <h2>Reservation ID: ${reservation.id}</h2>
              <p>User ID: ${reservation.user_id}</p>
              <p>Table Number: ${reservation.table_number}</p>
              <p>Number of Guests: ${reservation.num_guests}</p>
              <p>Date and Time: ${reservation.datetime}</p>
              <!-- Add more details as needed -->
            `;
            reservationList.appendChild(reservationDiv);
          });
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        // Handle error
      });
  });