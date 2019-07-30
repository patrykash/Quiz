//funckcja odpowiedzialna za przyczepianie menu do góry strony
/*function fixNav() {
    console.log("FIXNAV DZIALA!!!!!!!!");
    const fixedNav = document.getElementById("fixed-nav");
    const banner = document.getElementById("banner");
    let yScroll = window.scrollY;
    let distanceTop;
    if (slide) {
        console.log("Slide nieaktywny");
         distanceTop = 70;
    } else {
        console.log("Slide aktywny");
        distanceTop = 280;
    }



    if (yScroll > 70) {
        /!*fixedNav.classList.remove("fix-nav-popup");
        banner.classList.remove("banner-popup");*!/
        fixedNav.classList.add("fix-nav");
        document.body.style.paddingTop = distanceTop + "px";
    } else
    {
        document.body.style.paddingTop = "0";
        fixedNav.classList.remove("fix-nav");


    }
}*/

function fixNav() {
    const fixedNav = document.getElementById("fixed-nav");
    let yScroll = window.scrollY;

    if (yScroll > 70) {
        setTop(fixedNav, 0);
    } else
    {
        setTop(fixedNav, 70 - yScroll);
    }
}

function setTop(element, position) {
    element.style.top = position + "px";

}

//zmienna wykorzystywana w obu funkcjach pozwala na wysówanie menu domyślne ustawienie
let slide = true;
//odpowiada za wysowanie i zasowanie menu
function popupMenu() {
    const menuElements = document.getElementsByClassName("nav-option");

    console.log("dziala");
    console.log(slide);
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

