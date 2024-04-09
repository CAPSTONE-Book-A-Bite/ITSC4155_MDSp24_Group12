// This file contains the script for the frontend of the website

// For the frontend, menu navigation
const header = document.querySelector('header');
const menuBtn = document.querySelector('#menu-btn');
const closeMenuBtn = document.querySelector('#close-menu-btn');

menuBtn.addEventListener('click', () => {
  header.classList.toggle('show-menu');
});
closeMenuBtn.addEventListener('click', () => {
  header.classList.remove('show-menu');
});

const reserveBtn = document.getElementById("reserve-btn");


// reserveButton will check to see if user is not logged in and redirect to login page
reserveBtn.addEventListener("click", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/frontend/html/login.html";
  } else {
    window.location.href = "/frontend/html/customer.html";
  }
}
);