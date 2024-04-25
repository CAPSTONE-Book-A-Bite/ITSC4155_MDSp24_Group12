document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { email, password };
    try {
        const response = await fetch("http://localhost:3001/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();
        console.log(data);
        console.log(response.status);
        if (response.status != 200) {
            throw new Error(data.message);
        }
        document.cookie = `hostId=${data.hostId}; max-age=600`;
        document.cookie = `hostName=${data.hostName}; max-age=600`;
        // Redirect to home page
        window.location.href = "/hostHome";
    } catch (error) {
        console.log(JSON.stringify(error.message));
        //alert user with new div element in login container
        const alert = document.createElement("div");
        alert.className = "alert-danger";
        alert.innerHTML = error.message;
        document.getElementById("login-container").appendChild(alert);
        // remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}
);

document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is already logged in
    const hostId = getCookie("hostId");
    if (hostId) {
        window.location.href = "/hostHome";
    }
    const userId = getCookie("userId");
    if (userId){
        window.location.href = "/customer";
    }
    }
);

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    window.location.href = "/hostRegister";
});

function getCookie(name) {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes(name));
    return cookie ? cookie.split("=")[1] : null;
}
