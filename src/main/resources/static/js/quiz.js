'use strict';
window.onload = init;
function init() {
    window.addEventListener("scroll", function () {
        fixNav();
    });

    const openMenu = document.getElementById("nav-menu-mobile");
    openMenu.addEventListener("click", function () {
        popupMenu();
    });

    const quizDataService = {
        getQuestions () {
            let getQuestion = new XMLHttpRequest();
            getQuestion.open('GET', '/question/get', true);
            getQuestion.send(null);
             getQuestion.onload = function () {
                let responseObject;
                if(getQuestion.status )
                {
                    responseObject = JSON.parse(getQuestion.responseText);
                    question.setQuestions(responseObject);
                }
            };
        },

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

    quizDataService.getQuestions();

    const question = {

        randomQuestion() {
            let questionNumber = Math.floor(Math.random() * this.questions.length);
            this.setQuestionText(this.questions[questionNumber]);
            this.updateQuestions(questionNumber);
        },

        setQuestionText(drawnQuestion) {
            this.contents = drawnQuestion.content;
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
        endButton: document.getElementById("end"),

        clickStart() {
            requestAnimationFrame(function (starTime) {
                quizTime.updateClock(starTime, starTime);
            });
            question.randomQuestion();
            quizAnswers.addAnswersListener();
            quizInfo.setInfo();
            let elements = [quizOptions.nextButton,quizQuestion.questionField, quizAnswers.answerButtons[0], quizAnswers.answerButtons[1],
                quizAnswers.answerButtons[2], quizAnswers.answerButtons[3]];
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp,timestamp, quizInfo.quizTimeRule)
            });
            requestAnimationFrame(function (timestamp) {
                animations.hide(timestamp,timestamp,quizOptions.startButton, elements, true);
            });
        },

        clickNext() {
            requestAnimationFrame(function (starTime) {
                quizTime.updateClock(starTime, starTime);
            });
            question.randomQuestion();
            quizInfo.updateInfoValue();
            quizInfo.setInfo();
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
        },
        clickEnd() {
            window.location.href = 'classification.html';
        }
    };

    quizOptions.startButton.addEventListener("click", quizOptions.clickStart);
    quizOptions.endButton.addEventListener("click", quizOptions.clickEnd);
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
                    requestAnimationFrame( (timestamp) =>{
                        animations.hide(timestamp,timestamp,this.quizNick,[quizOptions.startButton,quizInfo.quizTimeRule]);
                    });
                }
            });
        },
    };

    playerNickName.setPlayerName();

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
            cancelAnimationFrame(quizTime.currentAnimation);
            const answer = this.innerText[0];
            quizAnswers.deactivateAnswers();
            if (question.goodAnswer === answer) {
                quizAnswers.showGoodAnswer(this);
                if (quizInfo.checkWin()) {
                    quizDataService.getQuestions();
                    quizInfo.winQuizInfo();
                    requestAnimationFrame(function (timestamp) {
                        animations.hide(timestamp, timestamp, quizOptions.nextButton, [quizOptions.endButton])
                    });
                } else {
                    quizOptions.nextButton.addEventListener("click", quizOptions.clickNext);
                }
            } else {
                quizDataService.getQuestions();
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

    const quizInfo = {
        stage: 1,
        playerPoints: 0,
        questPoints: 10,
        quizTitle: document.getElementById("quiz-title"),
        playerPointsInfo: document.getElementById("player-points"),
        questPointsInfo: document.getElementById("quest-points"),
        quizTimeRule: document.getElementById("quiz-time-rule"),

        setInfo() {
            this.quizTitle.innerText = "Etap " + this.stage + " z 10";
            this.playerPointsInfo.innerText = "Punkty: " + this.playerPoints;
            this.questPointsInfo.innerText = "Punkty do zdobycia: " + this.questPoints;
        },
        updateInfoValue() {
            this.stage = this.stage + 1;
            this.playerPoints = this.playerPoints + this.questPoints;
            this.questPoints = this.questPoints + 5;
        },


        resetInfo() {
            this.stage = 1;
            this.playerPoints = 0;
            this.questPoints =10;
            this.quizTitle.innerText = "Rozpocznij quiz";
            this.playerPointsInfo.innerText = "Punkty: 0";
            this.questPointsInfo.innerText = "Punkty do zdobycia: 10";
        },

        loseQuizInfo() {
            this.quizTitle.innerText = "Porażka";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            playerInfo.nickName =  playerNickName.playerName;
            playerInfo.points = this.playerPoints;
            quizDataService.addPlayer();

        },


        winQuizInfo() {
            this.quizTitle.innerText = "Wygrana";
            this.playerPointsInfo.innerText = "Zdobyte punkty " + this.playerPoints;
            this.questPointsInfo.innerText = " ";
            playerInfo.nickName =  playerNickName.playerName;
            playerInfo.points = this.playerPoints;
            quizDataService.addPlayer();
        },

        checkWin() {
            return this.stage === 10;
        }

    };

    const quizTime ={
        clock: document.getElementById("quiz-time"),
        currentAnimation: 0,

        updateClock(starTime,nowTime) {
            const questionTime = 60000;
            let currentTime = nowTime - starTime;
            currentTime = questionTime - currentTime;

            this.setClockTime(currentTime);

            if (Math.floor((currentTime/1000)) === 0) {
                cancelAnimationFrame(this.currentAnimation);
                quizDataService.getQuestions();
                quizAnswers.showGoodAnswer(document.getElementById("answer" + question.goodAnswer));
                requestAnimationFrame(function (timestamp) {
                    animations.hide(timestamp,timestamp,quizOptions.nextButton,[quizOptions.replayButton])
                });
                quizInfo.loseQuizInfo();
            } else {
                this.currentAnimation =requestAnimationFrame( (timestamp) =>{
                    this.updateClock(starTime,timestamp);
                });
            }
        },

        setClockTime(currentTime) {
            let clockS = Math.floor((currentTime / 1000)) % 60;
            let clockM = Math.floor((currentTime / 60000)) % 60;

            this.clock.innerText = "0" + clockM + " : " + clockS;
        }

    }


}
