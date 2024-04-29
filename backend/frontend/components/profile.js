// global variables to hold user password

let userPassword = "";

// ensure the user is logged in

if (!document.cookie.includes("userId")) {
  window.location.href = "/login";
}

window.onload = function () {
  // populate the profile page with the user's information
  const userId = document.cookie
    .split("; ")
    .find((cookie) => cookie.includes("userId"))
    .split("=")[1];
  fetch(`/api/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json(); // Parse the JSON data
    })
    .then((data) => {
      // Access the user object
      const user = data.user;
      document.getElementById("username").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = user.phone_number;

      // store the user password
      userPassword = user.password;
    })
    .catch((error) => {
      console.log(error.message);
    });
};

document.getElementById("back-button").addEventListener("click", () => {
  /* redirect user to previous page */
  window.history.back();
});

document.getElementById("profile-form").addEventListener("submit", (event) => {
  // prevent the form from submitting
  event.preventDefault();

  // ensure currnet password is correct
  const currentPassword = document.getElementById("current-password").value;
  if (currentPassword !== userPassword) {
    alert("Current password is incorrect");
    // clear form
    const form = document.getElementById("profile-form");
    form.reset();

    return;
  }

  // get the user's information
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("new-password").value;

  // parse phone to remove any dashes and parentheses
  const phoneArr = phone.split("");
  const phoneArrFiltered = phoneArr.filter((char) => {
    return char !== "-" && char !== "(" && char !== ")";
  });
  const phoneFiltered = phoneArrFiltered.join("");

  const user = {
    name: username,
    email: email,
    phone: phoneFiltered,
    password: password,
  };

  // get the user id
  const userId = document.cookie
    .split("; ")
    .find((cookie) => cookie.includes("userId"))
    .split("=")[1];

  // send the updated user information to the server

  fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return response.json();
    })
    .then((data) => {
      alert("User updated successfully");
      window.location.href = "/profile";
    })
    .catch((error) => {
      console.log(error.message);
    });
});
