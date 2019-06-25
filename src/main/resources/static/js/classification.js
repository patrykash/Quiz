window.onload = init;
function init() {
//pobiera liste graczy z bazy danych
    function getPlayers() {
        let getQuestion = new XMLHttpRequest();
        getQuestion.open('GET', '/players/get', true);
        getQuestion.send(null);
        getQuestion.onload = function () {
            let responseObject;
            console.log(getQuestion.status);
            if(getQuestion.status )
            {            console.log(getQuestion.status);

                responseObject = JSON.parse(getQuestion.responseText);
                let tab = document.getElementById("tabStart");
                let element;
                //tworzenie nowych elementow tabeli uzupelnianie danymi z bazy danych i dodawnie do strony
                for (let i = 0; i <10 ; i++) {
                    console.log(i);
                    element = document.createElement("tr");
                    element.innerHTML="<td>" + (i + 1) + "</td>"
                    +"<td>" + responseObject[i].nickName + "</td>" +
                        "<td>" + responseObject[i].points + "</td>"
                    tab.appendChild(element);
                }
            }
        };
    }
    getPlayers();
    window.addEventListener("scroll", function () {
        fixNav();
    });

    let openMenu = document.getElementById("nav-menu-mobile");
    openMenu.addEventListener("click", function () {
        popupMenu();
    });

}