window.onload = init;
function init() {
    window.addEventListener("scroll", function () {
        fixNav();
    });

    const openMenu = document.getElementById("nav-menu-mobile");
    openMenu.addEventListener("click", function () {
        popupMenu();
    });
    getPlayers();

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
                let tabElement;
                //tworzenie nowych elementow tabeli uzupelnianie danymi z bazy danych i dodawnie do strony
                for (let j = 0; j < 1; j++) {
                    for (let i = 0; i <10 ; i++) {
                        console.log(i);
                        tabElement = document.createElement("tr");
                        tabElement.innerHTML="<td>" + (i + 1) + "</td>"
                            +"<td>" + responseObject[i].nickName + "</td>" +
                            "<td>" + responseObject[i].points + "</td>";
                        tab.appendChild(tabElement);
                    }
                }

            }
        };
    }
}