class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
<style>
        /* Header styles -Start****************************************/
header {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 95px;
    background: url(../images/background.png) center/cover no-repeat;
    font-family: 'Poppins', sans-serif;
}

header.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 0 0 0;
    height: 95px;
}

.navbar .logo {
    font-size: 2.1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
}

.navbar .logo img {
    height: 75px;
}

.navbar .menu-links{
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    gap: 35px;
}

.navbar .menu-links li {
    font-size: 20px;
    font-weight: 500;
    color: white;
    text-decoration: none;
    transition: 0.2s ease;
    margin-top: 20px;
}

.navbar a {
    color: white;
    text-decoration: none;
    transition: 0.2s ease;
    font-size: 1.2rem;
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
                <li><a href='../index.html'>Book-A-Bite</a></li>
                <a href='../index.html' class="logo"><img src="../images/Logo.png" alt="logo"></img></a>
                <li><a class="active" href="/index">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/hostLogin">Host Sign In</a></li>
                <li><a href="/login">Login</a></li>
                <li><a class="reserve" href="/signout">Signout</a></li>
            </ul>
            </div>
        </header>
        `;
    }
}

customElements.define('header-component', Header);