document.addEventListener('DOMContentLoaded', () => {
    //check if user is logged in and redirect to login page if not
    const userId = document.cookie.split(';').find(cookie => cookie.includes('userId'));
    if (!userId) {
        window.location.href = '/login';
    }


    let restaurant;
    // fetch resteraunt information from the backend using query paramater
    fetch('http://localhost:3001/api/admin')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => { // Access the restaurants array


            const resteraunts = data.users;
            //filter through the resteraunts to find the one that matches the query paramater
            const urlParams = new URLSearchParams(window.location.search);
            const restaurantName = urlParams.get('restaurant');
            restaurant = resteraunts.find(restaurant => restaurant.name == restaurantName);
            //update the resteraunt info with the found resteraunt
            // removeSpaces in the name
            const trimmedName = restaurant.name.replace(/\s/g, '');
            document.getElementById('restaurant-image').src = '/api/images/' + trimmedName;
            document.getElementById('resteraunt-name').innerHTML = restaurant.name;
        })
        .catch(error => {
            console.log(error.message);
        });

        // fetch the users information
        fetch('http://localhost:3001/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => { // Access the users array
            const users = data.users;
            // filter through the users to find the the one that matched the cookie
            const userId = document.cookie.split(';').find(cookie => cookie.includes('userId')).split('=')[1];
            const user = users.find(user => user.id == userId);
            document.getElementById('your-name').innerHTML = 'Name: ' + user.name;
            document.getElementById('your-email').innerHTML = 'Email: ' + user.email;
            document.getElementById('your-phone').innerHTML = 'Phone: ' + user.phone_number;
        }
        )
        .catch(error => {
            console.log(error.message);
        });
            // get reservation by id and populate the confirmation page with the reservation details
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('reservation');

    fetch(`http://localhost:3001/api/reservations/${reservationId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reservation');
        }
        return response.json(); // Parse the JSON data
      })
      .then(data => {
        const reservation = data.reservation[0];
        const date = new Date(reservation.datetime).toDateString();
        let time = new Date(reservation.datetime).toLocaleTimeString();
        // remove seconds from time but keep AM/PM
        time = time.slice(0, -6) + time.slice(-3);
        // Reservation Confirmed! Your Book-A-Bite Reservation ID for Restaurant A is # under the name LastName, FirstName Booking Date: MM/DD/YYYY 4:15 PM 
        document.getElementById('reservation-created').innerHTML = `<b class="created">Reservation Confirmed!</b><br> Your Book-A-Bite Reservation ID </br>for <b>${reservation.restaurant}</b> is <b>${reservation.id}</b> <br>under the name <b>${reservation.name}</b></br> <br><b>Booking Date: ${date} ${time}</b></br>`;
    })
      .catch(error => {
        console.error('Error fetching reservation:', error);
        // Handle error
      });
}
);