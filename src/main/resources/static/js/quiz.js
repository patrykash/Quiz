'use strict';
window.onload = init;
function init() {
    //zajmuje się komunikacją z serwerem
    const quizController = {
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
            };
        },

        //przesyła dane uzytkownika na serwer
        addPlayer () {
            let addPlayer = new XMLHttpRequest();
            addPlayer.open('POST', '/players/save', true);
            addPlayer.setRequestHeader("Content-Type", "application/json");
            addPlayer.send(JSON.stringify(playerInfo));
            addPlayer.onload = function () {
                if(addPlayer.status )
                {
                    console.log(JSON.parse(addPlayer.responseText)) ;
                }
            };
        },
    };

    quizController.getQuestions();

    //obsluguje pytania po pobraniu z serwera
    const question = {

        randomQuestion() {
            let questionNumber = Math.floor(Math.random() * this.questions.length);
            this.setQuestionText(this.questions[questionNumber]);
            console.log(this.questions[questionNumber]);
            console.log(this.contents);
            this.updateQuestions(questionNumber);
        },

        setQuestionText(drawnQuestion) {
            this.contents = drawnQuestion.question;
            this.answers = [drawnQuestion.answerA, drawnQuestion.answerB, drawnQuestion.answerC, drawnQuestion.answerD];
            this.goodAnswer = drawnQuestion.goodAnswer;
        },

        updateQuestions(questionNumber) {
            this.questions.splice(questionNumber, 1);
        },

        setQuestions(questions) {
            this.questions = questions;
        }
    };

    const quizOptions = {

        startButton: document.getElementById("start"),
        replayButton: document.getElementById("replay"),
        nextButton: document.getElementById("next"),

        clickStart() {
            question.randomQuestion();
            //quizAnswers.setAnswers(question.answers);
            quizAnswers.addAnswersListener();
            quizInfo.setInfo();
            //quizQuestion.setQuestionText(question.contents);
            let elements = [quizOptions.nextButton,quizQuestion.questionField, quizAnswers.answerButtons[0], quizAnswers.answerButtons[1],
                quizAnswers.answerButtons[2], quizAnswers.answerButtons[3]];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp,timestamp,quizOptions.startButton, elements, true);
            });
        },

        clickNext() {
            question.randomQuestion();
            quizInfo.setInfo();
            quizInfo.updateInfoValue();
            let elements = [quizAnswers.answerButtons[0], quizAnswers.answerButtons[1],
                quizAnswers.answerButtons[2], quizAnswers.answerButtons[3], quizQuestion.questionField];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
            quizAnswers.addAnswersListener();
            quizOptions.nextButton.removeEventListener("click", quizOptions.clickNext);
        },

        clickReplay() {
            question.randomQuestion();
            quizInfo.resetInfo();
            quizInfo.setInfo();
            quizAnswers.addAnswersListener();
            let elements = [quizAnswers.answerButtons[0], quizAnswers.answerButtons[1],
                quizAnswers.answerButtons[2], quizAnswers.answerButtons[3], quizQuestion.questionField, quizOptions.nextButton];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp, timestamp, quizOptions.replayButton);
                animations.hide(timestamp, timestamp, elements[0]);
                animations.hide(timestamp, timestamp, elements[1]);
                animations.hide(timestamp, timestamp, elements[2]);
                animations.hide(timestamp, timestamp, elements[3]);
                animations.hide(timestamp, timestamp, elements[4], elements, true);
            });
        }
    };

    quizOptions.startButton.addEventListener("click", quizOptions.clickStart);
    const elementFunctions = {
        hide (element) {
            element.style.display = "none";
        },

        show (element) {
            element.style.display = "block";
        },
        showFlex (element) {
            element.style.display = "flex";
        }
    };

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
                this.updateQuiz(quizInfo);
                this.showElements(elements);
            }
        },
        showElements(elements) {
            if (elements !== undefined) {
                for (let i = 0; i < elements.length; i++) {
                    elementFunctions.show(elements[i]);
                    elements[i].style.opacity = "0";
                    window.requestAnimationFrame(function (timestamp) {
                        animations.show(timestamp,timestamp,elements[i])
                    });
                }
            }
        },
        updateQuiz(quizInfo) {
            if ((quizInfo !== undefined) && (quizInfo === true)) {
                quizAnswers.setAnswers(question.answers);
                quizAnswers.resetAnswersStyle();
                quizQuestion.setQuestionText(question.contents);
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
                    quizOptions.replayButton.addEventListener("click", quizOptions.clickReplay);
                    let elements = quizAnswers.answerButtons;
                    elements.push(quizOptions.startButton);
                    //this.quizNick.style.opacity = "1";
                    requestAnimationFrame( (timestamp) =>{
                        animations.hide(timestamp,timestamp,this.quizNick,elements);
                    });
                }
            });
        },
    };

    playerNickName.setPlayerName();

    //obsluguje przyciski odpowiedzi i wyswietlanie pytania

    const quizQuestion = {
        questionField: document.getElementById("question"),
        setQuestionText (contents) {
            this.questionField.innerText = contents;
        },
    };
    const quizAnswers = {
        answerButtons: [document.getElementById("answerA"), document.getElementById("answerB"),
            document.getElementById("answerC"), document.getElementById("answerD")],

        setAnswers(answers) {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].innerText = String.fromCharCode(65+i) + ": " + answers[i];
            }
        },

        resetAnswersStyle() {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].style.removeProperty('background-color');
                this.answerButtons[i].style.removeProperty('cursor');
            }
        },

        resetAnswersText() {
            for (let i = 0; i < 4; i++) {
                this.answerButtons[i].innerText = String.fromCharCode(64+i) + ":"
            }
            },

        addAnswersListener() {
            for (let answerButton of this.answerButtons) {
                answerButton.addEventListener("click", this.checkAnswer);
            }
        },

        checkAnswer() {
            const answer = this.innerText[0];
            quizAnswers.deactivateAnswers();
            if (question.goodAnswer === answer) {
                quizAnswers.showGoodAnswer(this);
                if (quizInfo.checkWin()) {
                    quizController.getQuestions();
                    quizInfo.winQuizInfo();
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp, timestamp, quizOptions.nextButton, [quizOptions.replayButton])
                    });
                } else {
                    quizOptions.nextButton.addEventListener("click", quizOptions.clickNext);
                }
            } else {
                quizController.getQuestions();
                quizAnswers.showBadAnswer(this);
                quizAnswers.showGoodAnswer(document.getElementById("answer" + question.goodAnswer));
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

        delAnswersListener() {
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
        setInfo() {
            this.quizTitle.innerText = "Etap " + this.stage + " z 10";
            this.playerPointsInfo.innerText = "Punkty: " + this.playerPoints;
            this.questPointsInfo.innerText = "Punkty do zdobycia: " + this.questPoints;
        },
        //aktualizuje etap, punkty
        updateInfoValue() {
            this.stage = this.stage + 1;
            this.playerPoints = this.playerPoints + this.questPoints;
            this.questPoints = this.questPoints + 5;
        },

        //resetuje do ustawien przed rozpoczeciem quizu
        resetInfo() {
            this.stage = 1;
            this.playerPoints = 0;
            this.questPoints =10;
            this.quizTitle.innerText = "Rozpocznij quiz";
            this.playerPointsInfo.innerText = "Punkty: 0";
            this.questPointsInfo.innerText = "Punkty do zdobycia: 10";
        },

        //obluguje dane oraz aktualizuje strone w razie porazki w quizie
        loseQuizInfo() {
            this.quizTitle.innerText = "Porażka";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNickName.playerName;
            playerInfo.points = this.playerPoints;
            quizController.addPlayer();

        },

        //obluguje dane oraz aktualizuje strone w razie wygranej w quizie

        winQuizInfo() {
            this.quizTitle.innerText = "Wygrana";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNickName.playerName;
            playerInfo.points = this.playerPoints;
            quizController.addPlayer();
        },

        //sprawdza czy ukonczylismy wszystkie etapy
        checkWin() {
            return this.stage === 10;
        }

    };

    window.addEventListener("scroll", function () {
        fixNav();
    });
    
    const openMenu = document.getElementById("nav-menu-mobile");

    openMenu.addEventListener("click", function () {
        popupMenu();
    });

}