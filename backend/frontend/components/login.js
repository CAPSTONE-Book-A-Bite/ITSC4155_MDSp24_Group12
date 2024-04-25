
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { email, password };
    console.log(loginData);
    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();
        if (response.status != 200) {
            throw new Error(data.error);
        }
        // save user id as a cookie that expires in 10 minutes
        document.cookie = `userId=${data.user.id} ; max-age=600`;
        document.cookie = `userName=${data.user.name} ; max-age=600`;
        // Redirect to home page
        window.location.href = "/customer";
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

        // clear input fields
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    }
});

document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    window.location.href = "/signup";
});

// check if user is already logged in and redirect to home page
if (document.cookie.includes("userId")) {
    window.location.href = "/customer";
}
// if user is host redirect to host page
if (document.cookie.includes("hostId")) {
    window.location.href = "/hostHome";
}

