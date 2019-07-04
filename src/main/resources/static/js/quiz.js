'use strict';
window.onload = init;
function init() {
    //zajmuje się komunikacją z serwerem
    class GetService {
        //wysyla zapytanie o pobranie listy pytan
        getQuestions () {
            let getQuestion = new XMLHttpRequest();
            getQuestion.open('GET', '/questionAndAnswer/get', true);
            getQuestion.send(null);
             getQuestion.onload = function () {
                let responseObject;
                if(getQuestion.status )
                {
                    console.log("Komunikat http: " + getQuestion.status)
                    responseObject = JSON.parse(getQuestion.responseText);
                    question.setQuestions(responseObject);
                    console.log(responseObject);
                }
                //questionAndAnswers.questions = responseObject;

            };

        };

        //przesyła dane uzytkownika na serwer
        addPlayer () {
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
    class Question {
        questions;
        contents;
        answers;
        goodAnswer;

        //losuje pytanie
        randomQuestion() {
            let questionNumber = Math.floor(Math.random() * this.questions.length);
            this.setQuestion(this.questions[questionNumber]);
            this.updateQuestions(questionNumber);
        };

        setQuestion(drawnQuestion) {
            this.contents = drawnQuestion.question;
            this.answers = [drawnQuestion.answerA, drawnQuestion.answerB, drawnQuestion.answerC, drawnQuestion.answerD];
            this.goodAnswer = drawnQuestion.goodAnswer;
        }
        //aktualzuje liste pytanusuwając to które było wylosowane
        updateQuestions(questionNumber) {
            this.questions.splice(questionNumber, 1);
        };

        setQuestions(questions) {
            this.questions = questions;
        }



    }

    const getService = new GetService();
    getService.getQuestions();
    const question = new Question;

    const quizOptions = {
        startButton: document.getElementById("start"),
        replayButton: document.getElementById("replay"),
        nextButton: document.getElementById("next"),
        clickStart() {
            question.randomQuestion();
            quizAnswer.setAnswers(question.answers);
            quizAnswer.setQuestion(question.contents);
            quizAnswer.addAnswersListener();
            quizInfo.setInfo();
            let elements = [quizOptions.nextButton,quizAnswer.questionText, quizAnswer.answerButtons[0], quizAnswer.answerButtons[1],
                quizAnswer.answerButtons[2], quizAnswer.answerButtons[3]];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp,timestamp,quizOptions.startButton, elements);
            });
        },
        clickNext() {
            question.randomQuestion();
            quizInfo.updateInfoValue();
            let elements = [quizAnswer.answerButtons[0], quizAnswer.answerButtons[1],
                quizAnswer.answerButtons[2], quizAnswer.answerButtons[3], quizAnswer.questionText];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
            quizAnswer.addAnswersListener();
            quizInfo.setInfo();
            quizOptions.nextButton.removeEventListener("click", quizOptions.clickNext);

        },
        clickReplay() {
            getService.getQuestions();
            quizInfo.resetInfo();
            quizAnswer.resetAnswersText.bind(question);
            question.randomQuestion.bind(question);
            let elements = [quizAnswer.answerButtons[0], quizAnswer.answerButtons[1],
                quizAnswer.answerButtons[2], quizAnswer.answerButtons[3], quizAnswer.questionText, quizOptions.nextButton];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, quizOptions.replayButton);
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
            quizAnswer.addAnswersListener();
            quizInfo.setInfo();
        }
    };

    quizOptions.startButton.addEventListener("click", quizOptions.clickStart);
    quizOptions.replayButton.addEventListener("click", quizOptions.clickReplay);
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
                    quizAnswer.setAnswers(question.answers);
                    quizAnswer.setQuestion(question.contents);
                    quizAnswer.resetAnswersStyle();

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
    };
    //Obsługuje pobieranie nicku gracza
    const playerNickName = {
        playerName: " ",
        quizNick: document.getElementById("quiz-nick"),
        playerNameInput: document.getElementById("player-name"),
        playerNameWarning: document.getElementById("player-name-warning"),
        saveButton : document.getElementById("save-name"),
        setPlayerName () {
            this.saveButton.addEventListener("click",  ()  => {
                this.playerName = this.playerNameInput.value;
                if (this.playerName.length < 5) {
                    elementFunctions.show(this.playerNameWarning);
                } else {
                    let elements = [quizOptions.startButton];
                    this.quizNick.style.opacity = "1";
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp,timestamp,playerNickName.quizNick,elements);
                    });
                }
            });
        },
    };

    playerNickName.setPlayerName();

    //obsluguje przyciski odpowiedzi i wyswietlanie pytania

    const quizAnswer = {
        answerButtons: [document.getElementById("answerA"), document.getElementById("answerB"),
            document.getElementById("answerC"), document.getElementById("answerD")],
        questionText: document.getElementById("question"),

        //ustawia odpowiedzi na wylosowane pytanie
        setAnswers: function (answers) {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].innerText = String.fromCharCode(65+i) + answers[i];
            }
        },

        //przywraca kolory do podstawowych
        resetAnswersStyle: function () {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].style.removeProperty('background-color');
                this.answerButtons[i].style.removeProperty('cursor');
            }
        },

        // resstuje pytanie i odpowiedz do momentu przed startem
        resetAnswersText: function () {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].innerText = String.fromCharCode(64+i)
            }
            },

        //dodaje eventy pozwalajace na klikniecie przycisku
        addAnswersListener: function () {
            for (let answerButton of this.answerButtons) {
                answerButton.addEventListener("click", this.checkAnswer);
            }
        },

        //usuówa eventy odpowiedzialne za klikniecie


        checkAnswer() {
            const answer = this.innerText[0];
            quizAnswer.deactivateAnswers();
            if (question.goodAnswer === answer) {
                quizAnswer.showGoodAnswer(this);
                if (quizInfo.checkWin()) {
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp, timestamp, quizOptions.nextButton, [quizOptions.replayButton])
                    });
                } else {
                    quizOptions.nextButton.addEventListener("click", quizOptions.clickNext);
                }
            } else {
                quizAnswer.showBadAnswer(this);
                quizAnswer.showGoodAnswer(document.getElementById("answer" + question.goodAnswer));
                requestAnimationFrame(function (timestamp) {
                    animations.hide(timestamp,timestamp,quizOptions.nextButton,[quizOptions.replayButton])
                });
                quizInfo.loseQuizInfo();
            }

        },

        deactivateAnswers() {
            for (let answerButton of this.answerButtons) {
                answerButton.style.cursor = "default";
            }
            this.delAnswersListener();
        },

        delAnswersListener: function () {
            for (let answerButton of this.answerButtons) {
                answerButton.removeEventListener("click", this.checkAnswer);
            }
        },

        showGoodAnswer(answerButton) {
            answerButton.style.backgroundColor = "#00FF37";
        },

        showBadAnswer(answerButton) {
            answerButton.style.backgroundColor = "#E6001B";
        },
        //ustawia wylosowane pytanie
        setQuestion: function (contents) {
            this.questionText.innerText = contents;
        },
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
            let correctAnswer = question.getCurrentAnswer();
            //jesli prawidlowa wyswietla ja na zielono i pozwala na przejscie do dalszego etapu
            if (correctAnswer === answer) {
                quizGame.deactivateAnswer([quizAnswer.answerButtonA, quizAnswer.answerButtonB,
                    quizAnswer.answerButtonC, quizAnswer.answerButtonD]);
                quizGame.showGoodAnswer(buttonId);
                if (quizInfo.checkWin()) {
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp,timestamp,quizOptions.nextButton, [quizOptions.replayButton])
                    });
                }            //jesli nie prawidłowa wyswietla ja na czerowona a prawidłowa na zielono i pozwala na rozpoczecie od nowa

            } else {
                quizGame.deactivateAnswer([quizAnswer.answerButtonA, quizAnswer.answerButtonB,
                    quizAnswer.answerButtonC, quizAnswer.answerButtonD]);
                correctAnswer ="answer"+ correctAnswer;
                quizGame.showBadAnswer(buttonId);
                quizGame.showGoodAnswer(correctAnswer);
                requestAnimationFrame(function (timestamp) {
                    animations.hide(timestamp,timestamp,quizOptions.nextButton,[quizOptions.replayButton])
                });
                quizInfo.loseQuizInfo();
            }//usuniecie eventow z przyciskow odpowiedzi
            quizAnswer.delAnswersListener();
            quizOptions.nextButton.addEventListener("click", quizOptions.clickNext);
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
            playerInfo.nickName =  playerNickName.playerName;
            playerInfo.points = this.playerPoints;
            getService.addPlayer();

        },

        //obluguje dane oraz aktualizuje strone w razie wygranej w quizie

        winQuizInfo: function () {
            this.quizTitle.innerText = "Wygrana";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNickName.playerName;
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
/*

//zamiast quizAnswer
class Answer{

    constructor(answer,buttonId) {
        this.answer = answer;
        this.answerButton = document.getElementById(buttonId);
    }

    setText(text) {
        this.answerButton.innerText = text;
    }

    resetStyle() {
        this.answerButton.style.removeProperty('background-color');
        this.answerButton.style.removeProperty('cursor');
    }

    resetText(text) {
        this.answerButton.innerText = text;
    }

    addListener(functionToAdd) {
        this.answerButton.addEventListener('click', functionToAdd);
    }

    delListener(functionToDel) {
        this.answerButton.addEventListener('click', functionToDel);
    }

    getAnswer() {
        return this.answer;
    }
}

//zamiast quizGame

class Quiz{
    selectedAnswer
}*/
