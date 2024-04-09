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
    height: 95px;
    padding: 20px;
    background: url(../../images/background.png) center/cover no-repeat;
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
    height: 75px;
    margin-bottom: 20px;
}

.navbar .menu-links{
    margin-bottom: 10px;
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    gap: 35px;
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
                <!--Link for title-->
                <a href='../index.html'>Book-A-Bite</a>
                <!--Link for logo-->
                <a href='../index.html' class="logo"><img src="../../images/Logo.png" alt="logo"></img></a>
                <li><a class="active" href="../index.html">Home</a></li>
                <li><a href="../html/about.html">About</a></li>
                <li><a href="../html/hostLogin.html">Host Sign In</a></li>
                <li><a href="../html/login.html">Login</a></li>
                <li><a class="reserve" href="">Reserve</a></li>
            </ul>
            </div>
        </header>
        `;
    }
}

customElements.define('header-component', Header);