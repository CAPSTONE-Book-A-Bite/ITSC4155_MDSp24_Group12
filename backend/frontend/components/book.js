document.addEventListener('DOMContentLoaded', () => {
    //check if user is logged in and redirect to login page if not
    const userId = document.cookie.split(';').find(cookie => cookie.includes('userId'));
    if (!userId) {
        window.location.href = '/login';
    }
    // update the start-booking h2 text with user's name
    const userName = document.cookie.split(';').find(cookie => cookie.includes('userName')).split('=')[1];
    document.getElementById('start-booking').innerHTML = 'Start Booking Your Table,' + userName + '!';


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
            // update the user info with the found user
            document.getElementById('start-booking').innerHTML = 'Start Booking Your Table,' + user.name + '!';
            document.getElementById('your-name').innerHTML = 'Name: ' + user.name;
            document.getElementById('your-email').innerHTML = 'Email: ' + user.email;
            document.getElementById('your-phone').innerHTML = 'Phone: ' + user.phone_number;
        }
        )
        .catch(error => {
            console.log(error.message);
        });
    // add event listener for the booking form submission

    const bookingForm = document.getElementById('booked');
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form submission

        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const partySize = document.getElementById('guests').value;
        const restaurantName = document.getElementById('resteraunt-name').innerHTML;
        const bookingData = { date, time, partySize, restaurantName };
        console.log(bookingData);
        // dateTime is a string in the format "YYYY-MM-DDTHH:MM:SS:SSSZ"
        const dateTime = date + 'T' + time + ':00.000Z';
        console.log(dateTime);
        // submit form with needed data
        // const { user_id, restaurant_id, num_guests, datetime } = req.body;
        const userId = document.cookie.split(';').find(cookie => cookie.includes('userId')).split('=')[1];
        const restaurantId = restaurant.id;
        const numGuests = partySize;
        
        const reservationData = { user_id: userId, restaurant_id: restaurantId, num_guests: numGuests, datetime: dateTime };
        try {
            const response = await fetch('http://localhost:3001/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });
            const data = await response.json();
            if (response.status != 200) {
                throw new Error(data.error);
            }
            console.log(data);
            // Redirect to confirmation page
            alert('Reservation created successfully');
            window.location.href = '/customer';
        } catch (error) {
            console.log(JSON.stringify(error.message));
            //alert user with new div element in login container
            const alert = document.createElement('div');
            alert.className = 'alert-danger';
            alert.innerHTML = error.message;
            document.getElementById('book-container').appendChild(alert);
            // remove alert after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }




    });
    
}
);


