document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { email, password };

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();
        console.log(data);
        console.log(data.error);
        if (response.status != 200) {
            throw new Error(data.error);
        }
        localStorage.setItem("userId", data.user.id);
        const userId = localStorage.getItem("userId");
        console.log("userId: ", userId);
        // Redirect to home page
        window.location.href = "/customer";
    } catch (error) {
        console.log(JSON.stringify(error.message));
        alert(JSON.stringify(error.message));
    }
});
