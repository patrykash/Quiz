window.onload = init;
function init() {
    window.addEventListener("scroll", function () {
        fixNav();
    });

    const openMenu = document.getElementById("nav-menu-mobile");
    openMenu.addEventListener("click", function () {
        popupMenu();
    });

    function getPlayers(callback) {
        let getQuestion = new XMLHttpRequest();
        getQuestion.open('GET', '/players/get', true);
        getQuestion.send(null);
        getQuestion.onload = function () {
            let responseObject;
            console.log(getQuestion.status);
            if(getQuestion.status )
            {            console.log("GetQuestion :" + getQuestion.responseText);
                responseObject = JSON.parse(getQuestion.responseText);
                callback(responseObject);
            }
        };
    }

    function createTable(players) {
        let tab = document.getElementById("tabStart");
        let tabElement;
        console.log(players.length);
            for (let i = 0; i <players.length ; i++) {
                console.log(i);
                tabElement = document.createElement("tr");
                tabElement.innerHTML="<td>" + (i + 1) + "</td>"
                    +"<td>" + players[i].nickName + "</td>" +
                    "<td>" + players[i].points + "</td>";
                tab.appendChild(tabElement);
            }
    }

    getPlayers(createTable);


}