document.addEventListener('DOMContentLoaded', () => {
  //check if user is logged in and redirect to login page if not
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/login";
  }  
  
  
  
  fetch('http://localhost:3001/api/reservations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        // reservation list is class name of the div where the reservations will be displayed
        const reservationList = document.getElementById('reservation-table');
        //get the table body element inside the reservation table
        document.getElementById('reservation-table').innerHTML = `<tr>
        <th>Restaurant</th>
        <th>Date</th>
        <th>Time</th>
        <th>Party Size</th>
        <th>Cancel</th>
        </tr>`;
        let reservations = data.reservations; // Access the reservations array
        console.log(JSON.stringify(reservations) + "before filter")
        if (Array.isArray(reservations)) {
          //log the userId in local Storage
          console.log(localStorage.getItem("userId"));
        
          // filter reservations to only show the ones that are made by the user
          reservations = reservations.filter(reservation => reservation.user_id == localStorage.getItem("userId"));
          console.log(reservations);
          let reservationCount = 1;
          reservations.forEach(reservation => {
            const date = reservation.datetime.split('T')[0];
            const time = reservation.datetime.split('T')[1].split('.')[0];

            // create a new row for each reservation
            const row = reservationList.insertRow(reservationCount);
            row.innerHTML = `
            <td>${reservation.restaurant}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>${reservation.num_guests}</td>
            <td><button class="cancel-button" id="cancel-button">Cancel</button></td>
            `;
            reservationCount++;
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
        console.log(`users: ${JSON.stringify(users)}`);
        const userId = localStorage.getItem("userId");
        console.log(`userId: ${userId}`);
        const user = users.find(user => user.id == userId);
        console.log(`user: ${JSON.stringify(user)}`)
        customerName.innerHTML = "Hello, "+ user.name;
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Handle error
      });


    // fetch resteraunts the user can book

    fetch('http://localhost:3001/api/admin')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        console.log(data);
        const restaurantContainer = document.getElementById('restaurant-list');
        const restaurants = data.users; // Access the restaurants array
        if (Array.isArray(restaurants)) {
            restaurants.forEach(restaurant => {
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('restaurant-info');
                restaurantDiv.innerHTML = `
                        <h3 class="restaurant-name">${restaurant.name}</h3>
                        <p class="restaurant-address">${restaurant.address}</p>
                        <p class="restaurant-phone">${restaurant.phone}</p>
                        <p class="restaurant-email">${restaurant.email}</p>
                        <button class="book-button" id="book-button">Book</button>
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

    let booking =  document.querySelectorAll(".restaurant-info")


    // create event listeners for all
    booking.forEach((book) => {
        book.addEventListener('click', async (event) => {
            const restaurantName = book.querySelector('.restaurant-name').innerText;
            console.log(restaurantName);

            // redirect to reservation page with params
            window.location.href = `../html/reservation.html?restaurant=${restaurantName}`;
        });
    }
    );
