document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const signupData = { name, email, password, phone };
    try {
        const response = await fetch("http://localhost:3001/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
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
        document.getElementById("signup-container").appendChild(alert);
        // remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);

        // clear input fields
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("phone").value = "";
    }
}
);
