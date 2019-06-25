
window.onload = init;
function init() {
    const questionAndAnswers = new QuestionAndAnswers();
    const getService = new GetService();
    getService.getQuestions();

    const quizButtons = {
        startButton: document.getElementById("start"),
        replayButton: document.getElementById("replay"),
        nextButton: document.getElementById("next"),
        clickStart() {
            questionAndAnswers.randomQuestion();
            let questionInformation = questionAndAnswers.getCurrentQuestion();
            quizButton.setAnswers(questionInformation);
            quizButton.setQuestion(questionInformation);
            quizButton.addAnswers();
            quizInfo.setInfo();
            let elements = [quizButtons.nextButton,quizButton.questionText, quizButton.answerButtonA, quizButton.answerButtonB,
                quizButton.answerButtonC, quizButton.answerButtonD];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp,timestamp,quizButtons.startButton, elements);
            });
        },
        clickNext() {
            questionAndAnswers.randomQuestion();
            quizInfo.updateInfoValue();
            let elements = [quizButton.answerButtonA, quizButton.answerButtonB,
                quizButton.answerButtonC, quizButton.answerButtonD, quizButton.questionText];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
            quizButton.addAnswers();
            quizInfo.setInfo();
            quizButtons.nextButton.removeEventListener("click", quizButtons.clickNext);

        },
        clickReplay() {
            getService.getQuestions();
            quizInfo.resetInfo();
            quizButton.resetQuiz();
            questionAndAnswers.randomQuestion();
            /* requestAnimationFrame(function (timestamp) {
                 animations.hide(timestamp, timestamp, quizButtons.replayButton, [quizButtons.startButton]);
             });*/
            let elements = [quizButton.answerButtonA, quizButton.answerButtonB,
                quizButton.answerButtonC, quizButton.answerButtonD, quizButton.questionText, quizButtons.nextButton];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, quizButtons.replayButton);
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
            quizButton.addAnswers();
            quizInfo.setInfo();
        }
    };

    quizButtons.startButton.addEventListener("click", quizButtons.clickStart);
    quizButtons.replayButton.addEventListener("click", quizButtons.clickReplay);
    const elementFunctions = {
        //ukrywa elemnety odpowiedzialne za pobieranie nicku
        hide (element) {
            element.style.display = "none";
        },

        //pokazuje elemnety odpowiedzialne za pobieranie nicku

        show (element) {
            element.style.display = "block";
        }
    };
    //Wykorzystywany przy przesyłaniu danych po porazce lub wygranej w quizie
    const playerInfo = {
        nickName:  "Gracz",
        points: "0"
    };

    const animations = {
        hide(timestamp,startTime, element, elements, quizInfo) {
            let opacityValue = (1 - ((timestamp - startTime)/100) * 0.25);
            element.style.opacity = opacityValue.toString();
            if (opacityValue > 0) {
                window.requestAnimationFrame(function (timestamp) {
                    animations.hide(timestamp,startTime,element, elements,quizInfo);
                });
            } else {
               elementFunctions.hide(element);
                if ((quizInfo !== undefined) && (quizInfo === true)) {
                    let questionInformation = questionAndAnswers.getCurrentQuestion();
                    quizButton.setAnswers(questionInformation);
                    quizButton.setQuestion(questionInformation);
                    quizButton.resetAnswerStyle();

                }
                if (elements !== undefined) {
                    for (let i = 0; i < elements.length; i++) {
                        elementFunctions.show(elements[i]);
                        elements[i].style.opacity = "0";
                        window.requestAnimationFrame(function (timestamp) {
                            animations.show(timestamp,timestamp,elements[i])
                        });
                    }
                }
            }
        },
        show(timestamp, startTime, element) {
            let opacityValue = (((timestamp - startTime)/100) * 0.10);
            element.style.opacity = opacityValue.toString();
            if (opacityValue < 1) {
                window.requestAnimationFrame(function (timestamp) {
                    animations.show(timestamp,startTime,element);
                });
            }
        },
        answersTransition(timestamp, startTime) {
            let answers = [quizButton.answerButtonA, quizButton.answerButtonB,
                quizButton.answerButtonC, quizButton.answerButtonD];

        }
    };
    //Obsługuje pobieranie nicku gracza
    const playerNameButton = {
        playerName: " ",
        quizNick: document.getElementById("quiz-nick"),
        playerNameInput: document.getElementById("player-name"),
        playerNameWarning: document.getElementById("player-name-warning"),
        saveButton : document.getElementById("save-name"),
        //dodaja obsługę eventu podczas kilkniecia zapisuje nick gracza
        setPlayerName: function () {
            this.saveButton.addEventListener("click", function () {
                playerNameButton.playerName = playerNameButton.playerNameInput.value;
                if (playerNameButton.playerName.length < 5) {
                    elementFunctions.show(playerNameButton.playerNameWarning);
                } else {
                    let elements = [quizButtons.startButton];
                    playerNameButton.quizNick.style.opacity = "1";
                   requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp,timestamp,playerNameButton.quizNick,elements);
                    });

                  /*  window.requestAnimationFrame(function (timestamp) {
                        elementFunctions.show(quizButtons.startButton);
                        quizButtons.startButton.style.opacity = "0";
                        animations.show(timestamp,timestamp,quizButtons.startButton )
                    })*/
                }
            });
        },

    };

    playerNameButton.setPlayerName();
    //obsluguje przyciski odpowiedzi i wyswietlanie pytania
    const quizButton = {
        answerButtonA: document.getElementById("answerA"),
        answerButtonB: document.getElementById("answerB"),
        answerButtonC: document.getElementById("answerC"),
        answerButtonD: document.getElementById("answerD"),
        questionText: document.getElementById("question"),

        //ustawia odpowiedzi na wylosowane pytanie
        setAnswers: function (questionInformation) {
            this.answerButtonA.innerText = "A: " + questionInformation.answerA;
            this.answerButtonB.innerText = "B: " + questionInformation.answerB;
            this.answerButtonC.innerText = "C: " + questionInformation.answerC;
            this.answerButtonD.innerText = "D: " + questionInformation.answerD;
        },

        //przywraca kolory do podstawowych
        resetAnswerStyle: function () {
            this.answerButtonA.style.removeProperty('background-color');
            this.answerButtonB.style.removeProperty('background-color');
            this.answerButtonC.style.removeProperty('background-color');
            this.answerButtonD.style.removeProperty('background-color');
            this.answerButtonA.style.removeProperty('cursor');
            this.answerButtonB.style.removeProperty('cursor');
            this.answerButtonC.style.removeProperty('cursor');
            this.answerButtonD.style.removeProperty('cursor');

        },
        //ustawia wylosowane pytanie
        setQuestion: function (questionInformation) {
            this.questionText.innerText = questionInformation.question;
        },

        // resstuje pytanie i odpowiedz do momentu przed startem
        resetQuiz: function () {
            this.answerButtonA.innerText = "A: ";
            this.answerButtonB.innerText = "B: ";
            this.answerButtonC.innerText = "C: ";
            this.answerButtonD.innerText = "D: ";
            },

        //dodaje eventy pozwalajace na klikniecie przycisku
        addAnswers: function () {
            this.answerButtonA.addEventListener("click", quizGame.checkAnswerA);
            this.answerButtonB.addEventListener("click",quizGame.checkAnswerB);
            this.answerButtonC.addEventListener("click", quizGame.checkAnswerC);
            this.answerButtonD.addEventListener("click", quizGame.checkAnswerD);
        },

        //usuówa eventy odpowiedzialne za klikniecie
        delAnswersListner: function () {
            this.answerButtonA.removeEventListener("click", quizGame.checkAnswerA);
            this.answerButtonB.removeEventListener("click", quizGame.checkAnswerB);
            this.answerButtonC.removeEventListener("click", quizGame.checkAnswerC);
            this.answerButtonD.removeEventListener("click", quizGame.checkAnswerD);
        }

    };

    const quizGame = {
        //funkcje dodawane do eventu cliclk przyciskow odpowiedzi
        checkAnswerA: function () {
            quizGame.checkAnswer("answerA", "A")
        },
        checkAnswerB: function () {
            quizGame.checkAnswer("answerB", "B")
        },
        checkAnswerC: function () {
            quizGame.checkAnswer("answerC", "C")
        },
        checkAnswerD: function () {
            quizGame.checkAnswer("answerD", "D")
        },
        //sprawdza czy odpowiedz była prawidlowa
        checkAnswer: function (buttonId, answer) {
            let correctAnswer = questionAndAnswers.getCurrentAnswer();
            //jesli prawidlowa wyswietla ja na zielono i pozwala na przejscie do dalszego etapu
            if (correctAnswer === answer) {
                quizGame.deactivateAnswer([quizButton.answerButtonA, quizButton.answerButtonB,
                    quizButton.answerButtonC, quizButton.answerButtonD]);
                quizGame.showGoodAnswer(buttonId);
                if (quizInfo.checkWin()) {
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp,timestamp,quizButtons.nextButton, [quizButtons.replayButton])
                    });
                }            //jesli nie prawidłowa wyswietla ja na czerowona a prawidłowa na zielono i pozwala na rozpoczecie od nowa

            } else {
                quizGame.deactivateAnswer([quizButton.answerButtonA, quizButton.answerButtonB,
                    quizButton.answerButtonC, quizButton.answerButtonD]);
                correctAnswer ="answer"+ correctAnswer;
                quizGame.showBadAnswer(buttonId);
                quizGame.showGoodAnswer(correctAnswer);
                requestAnimationFrame(function (timestamp) {
                    animations.hide(timestamp,timestamp,quizButtons.nextButton,[quizButtons.replayButton])
                });
                quizInfo.loseQuizInfo();
            }//usuniecie eventow z przyciskow odpowiedzi
            quizButton.delAnswersListner();
            quizButtons.nextButton.addEventListener("click", quizButtons.clickNext);
        },//zmienia kolor poprawnej odpowiedzi
        showGoodAnswer: function (answerId) {
            document.getElementById(answerId).style.backgroundColor = "#00FF37";
        },//zmienia kolor niepoprawnej odpowiedzi
        showBadAnswer: function (answerId) {
            document.getElementById(answerId).style.backgroundColor = "#E6001B";
        },
        deactivateAnswer: function (answers){
            for (let i = 0; i < answers.length; i++) {
                answers[i].style.backgroundColor = "#FFF";
                answers[i].style.cursor = "default";
            }
        },

    };

    //obsluguje informacje o quize
    const quizInfo = {
        stage: 1,
        playerPoints: 0,
        questPoints: 10,
        quizTitle: document.getElementById("quiz-title"),
        playerPointsInfo: document.getElementById("player-points"),
        questPointsInfo: document.getElementById("quest-points"),

        //ustawia wartosci informacyjne
        setInfo: function () {
            this.quizTitle.innerText = "Etap " + this.stage + " z 10";
            this.playerPointsInfo.innerText = "Punkty: " + this.playerPoints;
            this.questPointsInfo.innerText = "Punkty do zdobycia: " + this.questPoints;
        },
        //aktualizuje etap, punkty
        updateInfoValue: function () {
            this.stage = this.stage + 1;
            this.playerPoints = this.playerPoints + this.questPoints;
            this.questPoints = this.questPoints + 5;
        },

        //resetuje do ustawien przed rozpoczeciem quizu
        resetInfo: function () {
            this.stage = 1;
            this.playerPoints = 0;
            this.questPoints =10;
            this.quizTitle.innerText = "Rozpocznij quiz";
            this.playerPointsInfo.innerText = "Punkty: 0";
            this.questPointsInfo.innerText = "Punkty do zdobycia: 10";
        },

        //obluguje dane oraz aktualizuje strone w razie porazki w quizie
        loseQuizInfo: function () {
            this.quizTitle.innerText = "Porażka";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNameButton.playerName;
            playerInfo.points = this.playerPoints;
            getService.addPlayer();

        },

        //obluguje dane oraz aktualizuje strone w razie wygranej w quizie

        winQuizInfo: function () {
            this.quizTitle.innerText = "Wygrana";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNameButton.playerName;
            playerInfo.points = this.playerPoints;
            getService.addPlayer();
        },

        //sprawdza czy ukonczylismy wszystkie etapy
        checkWin: function () {
            if (this.stage === 10) {
                quizInfo.winQuizInfo();
                return true;
            } else {
                return false;
            }

        }

    };





    //zajmuje się komunikacją z serwerem
    function GetService() {
        //wysyla zapytanie o pobranie listy pytan
        this.getQuestions = function () {

            let getQuestion = new XMLHttpRequest();
            getQuestion.open('GET', '/questionAndAnswer/get', true);
            getQuestion.send(null);
            getQuestion.onload = function () {
                let responseObject;
                if(getQuestion.status )
                {
                    responseObject = JSON.parse(getQuestion.responseText);
                }
                questionAndAnswers.otherQuestions = responseObject;
            };
        };

        //przesyła dane uzytkownika na serwer
        this.addPlayer = function () {

            let getQuestion = new XMLHttpRequest();
            getQuestion.open('POST', '/players/save', true);
            getQuestion.setRequestHeader("Content-Type", "application/json");
            getQuestion.send(JSON.stringify(playerInfo));
            getQuestion.onload = function () {
                if(getQuestion.status )
                {
                    console.log(JSON.parse(getQuestion.responseText)) ;
                }
            };
        };

    }

    //obsluguje pytania po pobraniu z serwera
    function QuestionAndAnswers(otherQuestions,currentQuestion) {
        this.otherQuestions = otherQuestions;
        this.currentQuestion = currentQuestion;
        //losuje pytanie
        this.randomQuestion = function () {
            let questionNumber= Math.floor(Math.random() * this.otherQuestions.length) ;
            let drawnQuestion = this.otherQuestions[questionNumber];
            this.updateQuestions(questionNumber);
            this.currentQuestion =drawnQuestion;
        };
        //aktualzuje liste pytanusuwając to które było wylosowane
        this.updateQuestions = function (questionNumber) {
            this.otherQuestions.splice(questionNumber,1);
        };
        //zwraca informacje o wylosowanym pytaniu
        this.getCurrentQuestion = function () {
            return this.currentQuestion;
        }
        //zwraca poprawna odpowiedz do aktualnego pytania
        this.getCurrentAnswer = function () {
            return this.currentQuestion.goodAnswer;
        };
        
    }
//pobierane przycisk odpowiadajace za rozgrywke w quizie

//dodanie eventu obslugujacego przyczpione menu
    window.addEventListener("scroll", function () {
        fixNav();
    });
//pobranie przycisku menu wyswietlanego na malych ekranach
    var openMenu = document.getElementById("nav-menu-mobile");
    //dodanie eventu obslugujacego klikniecie i wywolujacego funkcje pozwlajaca na wysowanie i zasowanie manu
    openMenu.addEventListener("click", function () {
        popupMenu();
    });

}