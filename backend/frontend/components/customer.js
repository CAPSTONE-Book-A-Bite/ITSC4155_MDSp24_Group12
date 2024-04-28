document.addEventListener('DOMContentLoaded', async () => {
  //check if user is logged in and redirect to login page if not
  const userId = document.cookie.split(';').find(cookie => cookie.includes('userId'));
  if (!userId) {
    window.location.href = '/login';
  }
  await fetch('http://localhost:3001/api/reservations')
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
        <th class="secondLastHeader" colspan="2">Party Size</th>
        <th class="lastHeader"></th>
        </tr>`;
        let reservations = data.reservations; // Access the reservations array
        if (Array.isArray(reservations)) {
          const userId = document.cookie.split(';').find(cookie => cookie.includes('userId')).split('=')[1];
          // filter reservations to only show the ones that are made by the user
          reservations = reservations.filter(reservation => reservation.user_id == userId);
          // sort reservations by date
          reservations.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
          // filter reservations to only show the ones that are in the future
          reservations = reservations.filter(reservation => new Date(reservation.datetime) > new Date());
          let reservationCount = 1;
          reservations.forEach(reservation => {
            const date = new Date(reservation.datetime).toDateString();
            let time = new Date(reservation.datetime).toLocaleTimeString();
            // remove seconds from time but keep AM/PM 
            time = time.slice(0, -6) + time.slice(-3);



            // create a new row for each reservation
            const row = reservationList.insertRow(reservationCount);
            row.innerHTML = `
            <td>${reservation.restaurant}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td class="second-to-last-column">${reservation.num_guests}</td>
            <td class= "lastColumn"><button class="cancel-button" id="cancel-button">Cancel</button></td>
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
            let reservationTime = new Date(reservations[0].datetime).toLocaleTimeString();
            // remove seconds from time but keep AM/PM
            reservationTime = reservationTime.slice(0, -6) + reservationTime.slice(-3);
            if (reservationDate > now) {
              noReservations.innerHTML = `Your next reservation is on ${reservationDate.toDateString()} at ${reservationTime}`;
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

    await fetch('http://localhost:3001/api/users')
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
        const userId = document.cookie.split(';').find(cookie => cookie.includes('userId')).split('=')[1];
        const user = users.find(user => user.id == userId);
        customerName.innerHTML = "Hello, "+ user.name;
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Handle error
      });


    // fetch resteraunts the user can book

    await fetch('http://localhost:3001/api/admin')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        const restaurantContainer = document.getElementById('restaurant-list');
        const restaurants = data.users; // Access the restaurants array
        if (Array.isArray(restaurants)) {
            restaurants.forEach(async (restaurant) => {
              let lastUpdated = 'N/A';
              // fetch the last updated time for the restaurant
              await fetch(`http://localhost:3001/api/admin/lastUpdated/${restaurant.name}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to fetch last updated time');
                  }
                  return response.json(); // Parse the JSON data
                })
                .then(data => {
                  console.log(data);
                    lastUpdated = new Date(data.reservation.created_at);
                    lastUpdated.setHours(lastUpdated.getHours() - 4);
                    lastUpdated = lastUpdated.toLocaleString();
                })
                .catch(error => {
                  console.error('Error fetching last updated time:', error);
                  // Handle error
                });

                // compare lastUpdated to current time and display the time difference
                const now = new Date();
                const lastUpdatedTime = new Date(lastUpdated);
                const timeDifference = Math.floor((now - lastUpdatedTime) / 1000 / 60);
                if (timeDifference < 1) {
                  lastUpdated = 'Just now';
                } else if (timeDifference < 60) {
                  lastUpdated = `${timeDifference} minutes ago`;
                }
                else if (timeDifference >= 60 && timeDifference < 1440) {
                  lastUpdated = `${Math.floor(timeDifference / 60)} hours ago`;
                }
                else if (timeDifference >= 1440){
                  lastUpdated = `${Math.floor(timeDifference / 1440)} days ago`;
                }
                

                

                let restaurantName = restaurant.name;
                restaurantName = restaurantName.replace(/\s/g, '');
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('restaurant-info');
                restaurantDiv.innerHTML = `
                        <img class="restaurant-image" src="/api/images/${restaurantName}" alt="restaurant image">
                        <h3 class="restaurant-name">${restaurant.name}</h3>
                        <button class="availableTimes" id="book-button">See Available Times</button>
                        <p class="last-updated">Last updated: ${lastUpdated}</p>
                `;
                // add event listener to book button
                restaurantDiv.querySelector('.availableTimes').addEventListener('click', () => {
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

          // update no reservations message with most recent reservation
          if (document.getElementById('reservation-table').rows.length > 1) {
            const now = new Date();
            const reservationDate = new Date(document.getElementById('reservation-table').rows[1].cells[1].innerHTML);
            const reservationTime = document.getElementById('reservation-table').rows[1].cells[2].innerHTML;
            if (reservationDate > now) {
              noReservations.innerHTML = `Your next reservation is on ${reservationDate.toDateString()} at ${reservationTime}`;
            } else {
              noReservations.innerHTML = 'No reservations found';
            }
          }
        } catch (error) {
          console.error('Error canceling reservation:', error);
          // Handle error
        }
      }
    });
    }
    );
