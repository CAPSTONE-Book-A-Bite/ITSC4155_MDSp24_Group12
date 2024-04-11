document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { email, password };
    try {
        const response = await fetch("http://localhost:3001/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        localStorage.setItem("userId", data.userId);
        // Redirect to home page
        window.location.href = "/frontend/customer.html";
    } catch (error) {
        alert(error.message);
    }
});
