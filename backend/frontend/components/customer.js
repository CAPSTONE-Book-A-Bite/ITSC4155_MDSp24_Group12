document.addEventListener('DOMContentLoaded', () => {
  //check if user is logged in and redirect to login page if not
  const userId = document.cookie.split(';').find(cookie => cookie.includes('userId'));
  if (!userId) {
    window.location.href = '/login';
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
          // sort reservations by date
          reservations.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
          // filter reservations to only show the ones that are in the future
          reservations = reservations.filter(reservation => new Date(reservation.datetime) > new Date());
          console.log(reservations);
          let reservationCount = 1;
          reservations.forEach(reservation => {
            const date = new Date(reservation.datetime).toDateString();
            const time = new Date(reservation.datetime).toLocaleTimeString();


            // create a new row for each reservation
            const row = reservationList.insertRow(reservationCount);
            row.innerHTML = `
            <td>${reservation.restaurant}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>${reservation.num_guests}</td>
            <td><button class="cancel-button" id="cancel-button">Cancel</button></td>
            <p hidden id="reservation-id" class="reservation-id">${reservation.id}</p>
            `;
            reservationCount++;
          });
          // update no reservations message with most recent reservation
          const noReservations = document.getElementById('no-reservations');
          if (reservations.length > 0) {
            const now = new Date();
            // fetch closest reservation to now 
            const reservationDate = new Date(reservations[0].datetime);
            if (reservationDate > now) {
              noReservations.innerHTML = `Your next reservation is on ${reservationDate.toDateString()} at ${reservationDate.toLocaleTimeString()}`;
            } else {
              noReservations.innerHTML = 'No reservations found';
            }
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
                // add event listener to book button
                restaurantDiv.querySelector('.book-button').addEventListener('click', () => {
                    const restaurantName = restaurant.name;
                    // redirect to book page with restaurant name
                    window.location.href = `/book?restaurant=${restaurantName}`;
                });
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

    // add event listener for the cancel button
    document.getElementById('reservation-table').addEventListener('click', async (event) => {
      if (event.target.className === 'cancel-button') {
        const reservationId = event.target.parentElement.parentElement.querySelector('.reservation-id').innerHTML;
        console.log(reservationId);
        try {
          const response = await fetch(`http://localhost:3001/api/reservations/${reservationId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Failed to cancel reservation');
          }
          // remove the row from the table
          event.target.parentElement.parentElement.remove();
          // update no reservations message
          const noReservations = document.getElementById('no-reservations');
          if (document.getElementById('reservation-table').rows.length == 1) {
            noReservations.innerHTML = 'No reservations found';
          }
        } catch (error) {
          console.error('Error canceling reservation:', error);
          // Handle error
        }
      }
    });
    }
    );
