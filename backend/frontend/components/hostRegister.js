document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (response.status != 201) {
        throw new Error(data.message);
    }


    // actually sign up the user
    try {
        const response2 = await fetch('/api/admin/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('restaurantName'),
                email: formData.get('email'),
                password: formData.get('password'),
            })
        });

        const data2 = await response2.json();
        if (response2.status != 201) {
            throw new Error(data2.message);
        }
        // Redirect to login page
        window.location.href = "/hostLogin";
    } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up: ' + error.message);
    }

});