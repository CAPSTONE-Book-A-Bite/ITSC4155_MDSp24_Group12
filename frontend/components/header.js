class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
<style>
        /* Header styles -Start****************************************/
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px;
}

header.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.navbar .logo {
    font-size: 2.1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
}

.navbar .logo img {
    height: 100px;
}

.navbar .menu-links {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    gap: 35px;
}

.navbar a {
    color: white;
    text-decoration: none;
    transition: 0.2s ease;
}

.navbar a:hover {
    color: lightskyblue;
}
/* Header styles -End****************************************/
</style>
        <header>
            <div class="navbar">
            <!--Added menu-links-->
            <ul class="menu-links">
                <!--Link for title-->
                <a href='/frontend/index.html'>Book-A-Bite</a>
                <!--Link for logo-->
                <a href='/frontend/index.html' class="logo"><img src="/images/Logo.png" alt="logo"></img></a>
                <span id="close-menu-btn" class="material-symbols-outlined">close</span>
                <li><a class="active" href="/frontend/index.html">Home</a></li>
                <li><a href="/frontend/html/about.html">About</a></li>
                <li><a href="/frontend/html/contact.html">Contact</a></li>
                <li><a href="/frontend/html/login.html">Login</a></li>
                <li><a class="reserve" href="">Reserve</a></li>
            </ul>
            <span id="menu-btn" class="material-symbols-outlined">menu</span>
            </div>
        </header>
        `;
    }
}

customElements.define('header-component', Header);