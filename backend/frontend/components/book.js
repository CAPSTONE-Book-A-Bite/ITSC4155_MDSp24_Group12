document.addEventListener('DOMContentLoaded', () => {
    //check if user is logged in and redirect to login page if not
    const userId = document.cookie.split(';').find(cookie => cookie.includes('userId'));
    if (!userId) {
        window.location.href = '/login';
    }

    let bookingDate = document.getElementById('bookingDate');
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let minDate = yyyy + '-' + mm + '-' + dd;

    // Set the min attribute to today's date at 07:00 AM
    bookingDate.setAttribute('min', minDate);

    // Event listener to check the time is in the future
    let bookingTime = document.getElementById('bookingTime');
    bookingTime.addEventListener('change', () => {
        let time = bookingTime.value;
        let hour = parseInt(time.split(':')[0]);
        let minute = parseInt(time.split(':')[1]);
        let date = bookingDate.value;
        let year = parseInt(date.split('-')[0]);
        let month = parseInt(date.split('-')[1]);
        let day = parseInt(date.split('-')[2]);
        let bookingDateTime = new Date(year, month - 1, day, hour, minute);
        let currentDateTime = new Date();
        if (bookingDateTime < currentDateTime) {
            bookingTime.setCustomValidity('Please select a future time');
        } else {
            bookingTime.setCustomValidity('');
        }
    });
    // update the start-booking h2 text with user's name
    const userName = document.cookie.split(';').find(cookie => cookie.includes('userName')).split('=')[1];
    document.getElementById('start-booking').innerHTML = 'Start Booking Your Table, <br><b>' + userName + '!</b></br>';


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
    // add event listener for the booking form submission

    const bookingForm = document.getElementById('booked');
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form submission
        // validate booking date and time are in the future and betwwen 7am and 10pm
        const bookingTime = document.getElementById('bookingTime').value;
        const hour = parseInt(bookingTime.split(':')[0]);
        if (hour < 7 || hour >= 22) {
            alert('Please select a time between 7am and 10pm');
            // clear the form
            bookingForm.reset();
            return;
        }
        const date = document.getElementById('bookingDate').value;
        const dateTime = date + 'T' + bookingTime + ':00.000Z';
        const partySize = document.getElementById('guests').value;
        const restaurantName = document.getElementById('resteraunt-name').innerHTML;
        
        // dateTime is a string in the format "YYYY-MM-DDTHH:MM:SS:SSSZ"
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
            // Redirect to confirmation page
            alert('Reservation created successfully');
            // reroute to confirmation page with the reservation id passed in as a query parameter and restaurant name trimmed of spaces
            window.location.href = '/confirmation?reservation=' + data.reservation.id + '&restaurant=' + restaurantName.replace(/\s/g, '');
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
            // clear the form
            bookingForm.reset();
        }




    });
    
}
);