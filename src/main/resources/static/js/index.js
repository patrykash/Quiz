window.onload = init;
    function init() {
        window.addEventListener("scroll", function () {
            fixNav();
        });

        var openMenu = document.getElementById("nav-menu-mobile");
        openMenu.addEventListener("click", function () {
            popupMenu();
        });
    }