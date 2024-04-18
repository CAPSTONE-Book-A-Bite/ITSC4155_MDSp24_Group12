document.addEventListener("DOMContentLoaded", async () => {
    // delete the cookies
    document.cookie = 'userId=; max-age=0';
    document.cookie = 'userName=; max-age=0';
    document.cookie = 'hostId=; max-age=0';
    document.cookie = 'hostName=; max-age=0';
    // Redirect to login page after waiting for 4 seconds
    setTimeout(() => {
        window.location.href = "/login";
    }, 4000);
}
);
