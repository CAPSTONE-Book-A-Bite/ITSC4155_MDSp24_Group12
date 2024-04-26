document.addEventListener('DOMContentLoaded', function() {
    // check if the host is logged in
    const hostName = getCookie('hostName');
    if (!hostName) {
        window.location.href = '/hostLogin';
    }
    
    // change the restaurant-text to the host's restaurant name
    //    <h1 class="restaurant-text">Restaurant Booking List</h2>
    document.querySelector('.restaurant-text').innerHTML = `${hostName} Restaurant Booking List`;
    // get the host's id
    
    // check to see if the host has any bookings for the day
    // if not, display a message saying there are no bookings

    fetch('http://localhost:3001/api/reservations/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
    // filter reservations by restaurant name
    const reservations = data.reservations.filter(reservation => reservation.restaurant == hostName);

    // filter reservations for this upcoming week
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingReservations = reservations.filter(reservation => new Date(reservation.datetime) >= today && new Date(reservation.datetime) <= nextWeek);
    console.log(upcomingReservations);
    // sort reservations by date
    upcomingReservations.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    //update reservations for this upcoming week text, corresponding html element is <h3 class="reservation-number">There are <u class="underlined-reservations">9</u> reservations for this upcoming week</h3>
    document.querySelector('.underlined-reservations').innerHTML = upcomingReservations.length;
    // if there are no reservations for the week, display a message
    if (upcomingReservations.length == 0) {
        document.querySelector('.reservation-number').innerHTML = 'There are no reservations for this upcoming week';
    }
    // if there is only 1 reservation for the week, display a message
    else if (upcomingReservations.length == 1) {
        document.querySelector('.reservation-number').innerHTML = 'There is <u>1</u> reservation for this upcoming week';
    }

    // add a table row for each reservation

    const table = document.querySelector('.reservations-table');
    let numCount = 1;
    upcomingReservations.forEach(reservation => {

        const date = new Date(reservation.datetime);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const formattedDate = `${month}-${day}-${year}`;


        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = 'AM';
        if (hours > 12) {
            hours -= 12;
            ampm = 'PM';
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        const time = `${hours}:${minutes} ${ampm}`;




        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${numCount}</td>
        <td>${reservation.name}</td>
        <td>${reservation.email}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td>${reservation.num_guests}</td>
        <td><button class="cancel-button">Cancel</button></td>
        <p hidden id="reservation-id" class="reservation-id">${reservation.id}</p>
        `;
        table.appendChild(row);
        console.log('table rows now:', table.rows.length)
        numCount++;
    });
    }
    )
    .catch(error => {
        console.error('Error:', error);
    }
    );




});


// function to cancel a reservation when the cancel button is clicked

document.getElementById('reservations-table').addEventListener('click', (event) => {
    if (event.target.className === 'cancel-button') {
      const reservationId = event.target.parentElement.parentElement.querySelector('.reservation-id').innerHTML;
      console.log(reservationId);
      try {
        const response = fetch(`http://localhost:3001/api/reservations/${reservationId}`, {
          method: 'DELETE',
        });
        if (!response.status == 200) {
          throw new Error('Failed to cancel reservation');
        }
        // remove the row from the table
        event.target.parentElement.parentElement.remove();

        // update no reservations message
        const table = document.getElementById('reservations-table');
        if (table.rows.length == 1) {
          document.getElementById('reservation-number').innerHTML = 'There are no reservations for this upcoming week';
        }
        else if (table.rows.length == 2) {
          document.getElementById('reservation-number').innerHTML = 'There is <u>1</u> reservation for this upcoming week';
        }
        else {
          document.getElementById('reservation-number').innerHTML = `There are <u class="underlined-reservations">${table.rows.length - 1}</u> reservations for this upcoming week`;
        }

      } catch (error) {
        console.error('Error canceling reservation:', error);
        // Handle error
      }
    }
  });


function getCookie(name) {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes(name));
    return cookie ? cookie.split("=")[1] : null;
}