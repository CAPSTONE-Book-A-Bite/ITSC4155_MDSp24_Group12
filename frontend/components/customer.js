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
            const reservationDiv = document.createElement('div');
            reservationDiv.classList.add('reservation');
            reservationDiv.innerHTML = `
                <div class="reservation-info">
                    <h2 class="reservation-id">Reservation ID: ${reservation.id}</h2>
                    <p class="user-id">User ID: ${reservation.user_id}</p>
                    <p class="table-number">Table Number: ${reservation.table_number}</p>
                    <p class="num-guests">Number of Guests: ${reservation.num_guests}</p>
                    <p class="datetime">Date and Time: ${reservation.datetime}</p>
                </div>
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
        const restaurantList = document.getElementById('resteraunt-list');
        const restaurants = data.restaurants; // Access the reservations array
        if (Array.isArray(restaurants)) {
          restaurants.forEach(restaurant => {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('restaurant');
            restaurantDiv.innerHTML = `
                <div class="restaurant-info">
                    <h2 class="restaurant-id">Restaurant ID: ${restaurant.id}</h2>
                    <p class="restaurant-name">Restaurant Name: ${restaurant.name}</p>
                    <p class="restaurant-address">Restaurant Address: ${restaurant.address}</p>
                    <p class="restaurant-phone">Restaurant Phone: ${restaurant.phone}</p>
                    <p class="restaurant-email">Restaurant Email: ${restaurant.email}</p>
                </div>
            `;
            restaurantList.appendChild(restaurantDiv);
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
