/*globals document, window, $, Cookies */
var easyQuestions;
var hardQuestions;
var veryHardQuestions;
var zashevLevel = 1;
(function () {
    $.getJSON("db/easy-question.json", function (easyQuestionsData) {
        $.getJSON("db/hard-question.json", function (hardQuestionsData) {
            $.getJSON("db/very-hard-question.json", function (veryHardQuestionsData) {
                easyQuestions = easyQuestionsData;
                hardQuestions = hardQuestionsData;
                veryHardQuestions = veryHardQuestionsData;
                getQuestion(easyQuestions);
            });
        });
    });
})();

function getQuestion(questionsToAsk) {
    var containerTemplate = "<h2 data-questionId=\"%questionId%\">%question%</h2>\n" +
        "        <div class=\"panel\">\n" +
        "            <div class=\"answers-row\"><div class=\"answer\"><button onclick=checkAnswer(this)>%answera%</button></div><div class=\"answer\"><button onclick=checkAnswer(this)>%answerb%</button></div></div>\n" +
        "            <div class=\"answers-row\"><div class=\"answer\"><button onclick=checkAnswer(this)>%answerc%</button></div><div class=\"answer\"><button onclick=checkAnswer(this)>%answerd%</button></div></div>\n" +
        "</div>\n";
    $("h2").empty();
    $("#question-container").empty();

    var question = questionsToAsk[Math.floor(Math.random() * questionsToAsk.length)];
    var answers = question.answers;
    var containerHtml = containerTemplate
        .replace(/%answera%/g, answers[0])
        .replace(/%answerb%/g, answers[1])
        .replace(/%answerc%/g, answers[2])
        .replace(/%answerd%/g, answers[3])
        .replace(/%questionId%/g, question.questionId)
        .replace(/%question%/g, question.question);
    $("#question-container").append(containerHtml);
    $(".jumbotron").empty();
    $(".jumbotron").css('background-image', 'url(' + question.image + ')');
}

function checkAnswer(button) {
    var questionId = document.querySelector("h2").dataset.questionid;
    var answer = button.innerHTML;
    var buttons = document.querySelectorAll("button");
    buttons.forEach(function (button) {
        button.disabled = true;
    });
    if (zashevLevel === 1) {
        evaluateAnswer(easyQuestions, answer, zashevLevel, questionId);
    } else if (zashevLevel === 2) {
        evaluateAnswer(hardQuestions, answer, zashevLevel, questionId);
    } else {
        evaluateAnswer(veryHardQuestions, answer, zashevLevel, questionId);
    }
}

function evaluateAnswer(questions, answer, zashevLevelParam, questionId) {
    var question;
    question = questions.filter(function (element) {
        return element.questionId == questionId;
    });
    if (question[0].answer == answer) {
        $("#result").css('background-image', 'url('+"/img/right.jpg"+')');
        questions = questions.filter(function (element) {
            return element.questionId != questionId;
        });

        if (zashevLevelParam == 1) {
            easyQuestions = questions;
            if (easyQuestions.length > 0) {
                getQuestion(easyQuestions);
            } else {
                zashevLevel = 2;
                getQuestion(hardQuestions);
            }
        } else if (zashevLevelParam == 2) {
            hardQuestions = questions;
            if (hardQuestions.length > 0) {
                getQuestion(hardQuestions);
            } else {
                zashevLevel = 3;
                getQuestion(veryHardQuestions);
            }
        } else {
            veryHardQuestions = questions;
            if (veryHardQuestions.length > 0) {
                getQuestion(veryHardQuestions);
            } else {
                $("#result").empty();
                $("#result").css('background-image', 'url('+"/img/win.jpg"+')');
                removeAllData();
            }
        }


    } else {
        $("#result").css('background-image', 'url('+"/img/wrong.jpg"+')');
        removeAllData();
    }
}

function removeAllData() {
    easyQuestions = [];
    hardQuestions = [];
    veryHardQuestions = [];
}
