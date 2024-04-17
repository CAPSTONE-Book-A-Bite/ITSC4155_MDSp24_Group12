// This file contains the script for the frontend of the website



const reserveBtn = document.getElementById("reserve-btn");


// reserveButton will check to see if user is not logged in and redirect to login page
reserveBtn.addEventListener("click", () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "../frontend/html/login.html";
  } else {
    window.location.href = "../frontend/html/customer.html";
  }
}
);

const signupBtn = document.getElementById("sign-up-btn");

signupBtn.addEventListener("click", () => {
  window.location.href = "/signup";
}
);