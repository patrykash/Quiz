function fixNav() {
    const fixedNav = document.getElementById("fixed-nav");
    let yScroll = window.scrollY;


    if (yScroll > 70) {
        fixedNav.classList.add("fix-nav");
    } else
    {
        fixedNav.classList.remove("fix-nav");
    }

}

let slide = true;
function popupMenu() {
    const menuElements = document.getElementsByClassName("nav-option");
    let yScroll = window.scrollY;

    if (slide) {
        menuElements[0].style.display = " block";
        menuElements[1].style.display = " block";
        menuElements[2].style.display = " block";
        slide=false;

    } else {
        menuElements[0].style.display = " none";
        menuElements[1].style.display = " none";
        menuElements[2].style.display = " none";
        slide=true;
    }


}

