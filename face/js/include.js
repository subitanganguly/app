async function loadIncludes() {

    const nav = document.getElementById("navbar");
    const footer = document.getElementById("footer");

    if (nav) {
        const html = await fetch("includes/navbar.html").then(r => r.text());
        nav.innerHTML = html;
    }

    if (footer) {
        const html = await fetch("includes/footer.html").then(r => r.text());
        footer.innerHTML = html;
    }

    // Refresh auth UI after navbar loads
    if (typeof initNavbarAuth === "function") {
        initNavbarAuth();
    }
}

document.addEventListener("DOMContentLoaded", loadIncludes);