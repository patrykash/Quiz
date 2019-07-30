window.onload = init;
    function init() {
        fixNav();
        window.addEventListener("scroll", function () {
            fixNav();
        });

        const openMenu = document.getElementById("nav-menu-mobile");
        openMenu.addEventListener("click", function () {
            popupMenu();
        });
    }