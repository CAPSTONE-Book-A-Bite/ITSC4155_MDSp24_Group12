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
        let reservations = data.reservations; // Access the reservations array
        if (Array.isArray(reservations)) {
          reservations = reservations.filter(reservation => reservation.user_id === localStorage.getItem("userId"));
          reservations.forEach(reservation => {
            const date = reservation.datetime.split(' ')[0];
            const time = reservation.datetime.split(' ')[1];
            const reservationDiv = document.createElement('div');
            reservationDiv.classList.add('reservation');
            reservationDiv.innerHTML = `<tr><td>${reservation.restaurant}</td>
                <td>${date}</td>
                <td>${time}</td>
                <td>${reservation.num_guests}</td>
                <td><button class="cancel-button" id="cancel-button">Cancel</button></td>
                </tr>`;
            reservationList.appendChild(reservationDiv);
          });
          // if reservation is in the next 24 hours change no-reservation id to let you know about reservation

            const now = new Date();
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + 1);
            const nextDayString = nextDay.toISOString().split('T')[0];
            const nextDayReservations = reservations.filter(reservation => reservation.datetime.split('T')[0] === nextDayString);
            if (nextDayReservations.length > 0) {
              const noReservation = document.getElementById('no-reservation');
              noReservation.innerHTML = 'You have a reservation in the next 24 hours!';
            }
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        // Handle error
      });


    // fetch userInfo

    fetch('http://localhost:3001/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        const customerName = document.getElementById('customer-name');
        // populate customer name with the user in the array that shares sameId in local storage
        const users = data.users;
        const userId = localStorage.getItem("userId");
        const user = users.find(user => user.id === userId);
        customerName.innerHTML = "Hello,"+ user.name;
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Handle error
      });


    // fetch resteraunts the user can book

    fetch('http://localhost:3001/api/restaurants')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        const restaurantContainer = document.getElementById('restaurant-container');
        const restaurants = data.restaurants; // Access the restaurants array
        if (Array.isArray(restaurants)) {
            restaurants.forEach(restaurant => {
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('restaurant-info');
                restaurantDiv.innerHTML = `
                        <h3 class="restaurant-name">${restaurant.name}</h3>
                        <p class="restaurant-address">${restaurant.address}</p>
                        <p class="restaurant-phone">${restaurant.phone}</p>
                        <p class="restaurant-email">${restaurant.email}</p>
                `;
                restaurantContainer.appendChild(restaurantDiv);
            });
        }
        else {
          throw new Error('Invalid response format');
        }
        }
        )
        .catch(error => {
          console.error('Error fetching restaurants:', error);
          // Handle error
        });
    }
    );
