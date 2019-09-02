$(document).ready(function () {
    $('#questPanel').hide();
    $('#msgPanel').hide();
    $('#progPanel').hide();
});

var fakeSpaceTitles = ["Space Socks - Your guide to the galaxy",
    "Hitchhiker's guide to Glassware",
    "Honey, who shrunk the Johnson Space Center",
    "Apollo Ono - Blast Off !!!",
    "Space Shut-da-front-door dotcom"];

var fakeCowboyTitles = ["Yee Haw, the last straw",
    "Beverly Hills Cowboy",
    "Mavis Beacon teaches side-saddle",
    "Wild West City - how stuntmen got shot",
    "'Say my name' wit dat Texas drawl"];

var fakePokemonTitles = ["Detective Pick and Choose",
    "Ears Nobs and Hills Nair - Strategy guide",
    "EeeVee Oh Oh - Pokemon guide to Extra Virgin Olive Oil",
    "Oprah's guide to Machop - Machamp - Machump",
    "Pokemon - The Evolution Revolution"]

var fakeDogsTitles = ["Dog Dazed and Confounded",
    "Dogsh!t patrol - Somebody's got to do it",
    "Stop, drop, and roll in your own fecal matter",
    "Bow wow wow, hippie eye aye muther f'er",
    "My dog is better than your honor student"];

var fakeCatsTitles = ["3's Cacaphony",
    "Feline, Filn, Flarn, and the self-cleaning litter box",
    "Mook Tunandin - Spiritual Cat Leader",
    "The Cat's Arse",
    "The man who named his cat, cat"];

var badAnswerArray = [
    "You gotta be kidding me...",
    "Is that the best you've got?",
    "Wrong... you just got outwitted by a chimpanze in a diaper!",
    "Incorrect",
    "Umm... no.",
    "Not quite, but I can't blame you; that was a tough one",
    "I'm not gonna lie; that was a pathetic answer",
    "Nope...",
    "You are entitled to your own opinion, not your own facts!",
    "If I agreed with you, we would both be wrong!"
];

var imgAry = [
    "icons8-film-reel-48.png",
    "icons8-movie-ticket-40.png",
    "icons8-clapperboard-64.png",
    "icons8-movie-projector-64.png",
    "icons8-popcorn-64.png"
]

var movieSerList = [];
var movieSerArray = [];
var mTitleArray = [];
var mYearArray = [];
var mRatingArray = [];
var mPrimaryActor = [];
var mQtype = [];
var mQuestion = [];
var mAnswer = [];
var mxTra = [];

var queryURL = "";
var correctAnswer = "";
var correctAnswerNum = 0;
var questionNum = 0;
var correct = 0;
var toggle = false;
var gameDone = false;
var genreID = 0;
var timerSet = false;
var timerHandle = 0;

var decAry = [[10, -10, -20], [-10, -20, 10], [-20, 10, -10], [-30, -10, 10]];

function initVars() {
    movieSerList = [];
    movieSerArray = [];
    mTitleArray = [];
    mYearArray = [];
    mRatingArray = [];
    mPrimaryActor = [];
    mQtype = [];
    mQuestion = [];
    mAnswer = [];
    mxTra = [];
    queryURL = "";
    correctAnswer = "";
    correctAnswerNum = 0;
    questionNum = 0;
    correct = 0;
    gameDone = false;
    genreID = 0;
    timerSet = false;
    timerHandle = 0;
}

function renderQuestion(guess) {
    $("#hCorrect").html(`<font color="green">correct = ${correct}</font>`);
    $("#hQuestion").html(`Question #${questionNum + 1}: ${mQuestion[questionNum]}`);
    correctAnswerNum = Math.floor(Math.random() * 4);
    correctAnswer = mAnswer[questionNum];
    $("#choice" + correctAnswerNum).html("<a href='javascript:userChoice(" + correctAnswerNum + ");'>" + correctAnswer + "</a>");

    switch (String(mQtype[questionNum])) {
        case "A":
        case "A+":
        case "F":
        case "R":
            var elementPushed = [];
            elementPushed.push(questionNum);
            for (let x = 0; x < 3; x++) {
                var nextAnswer = x + correctAnswerNum + 1;
                if (nextAnswer > 3) {
                    nextAnswer = nextAnswer - 4;
                }
                var randElementNum = elementPushed[0];
                while (elementPushed.indexOf(randElementNum) != -1) {
                    randElementNum = Math.floor(Math.random() * 10);
                }
                elementPushed.push(randElementNum);
                $("#choice" + nextAnswer).html(`<a href='javascript:userChoice(${nextAnswer});'>${mTitleArray[randElementNum]}</a > `);
            }
            break;
        case "D":
            let randSeq = Math.floor(Math.random() * 4);
            digit = correctAnswer.substr(2, 1);
            for (let x = 0; x < 3; x++) {
                var nextAnswer = x + correctAnswerNum + 1;
                if (nextAnswer > 3) {
                    nextAnswer = nextAnswer - 4;
                }
                var newYear = correctAnswer.substr(0, 3) + "0"
                newYearNum = parseInt(newYear) + parseInt(decAry[randSeq][x]);
                if (newYearNum == 2020)
                    newYearNum = 1970;
                $("#choice" + nextAnswer).html(`<a href='javascript:userChoice(${nextAnswer});'>${newYearNum}</a > `);
            }
            break;
    }
}

function clearmxTra() {
    $("#hMessage").html("<br>");
    $(".hrColor").css("border-top", "1px solid lightgrey");
    timerSet = false;
}

function finGame() {
    $("#choice0").html("You finished in time !!");
    resetGame();
}

function endGame() {
    $("#choice0").html("You ran out of time");
    $("#hQuestion").html("");
    resetGame();
}

function resetGame() {
    clearmxTra();
    $("#hMessage").html("<br>");
    $('#msgPanel').hide();
    randImg = Math.floor(Math.random() * 5);
    $("#choice1").html(`<img src="./assets/images/${imgAry[randImg]}"></img>`);
    $("#choice2").html("Click a category above to play again");
    $("#choice3").html("")
    $('.catbtns').removeAttr('disabled');
    $('#btn-' + genreID).removeClass("btn-primary");
    $('#btn-' + genreID).addClass("btn-secondary");
    $('.catbtns').removeClass("btn-secondary");
    $('.catbtns').addClass("btn-primary");
}

function startTimer() {
    var counter = 60;
    var interval = setInterval(function () {
        counter--;
        if (gameDone)
            clearInterval(interval);

        if (counter < 10) {
            $('#hTimer').text("00:0" + counter);
            if (!toggle) {
                $('#timerColor').addClass("bg-warning");
                toggle = true;
            } else {
                $('#timerColor').removeClass("bg-warning")
                toggle = false;
            }
        } else {
            $('#hTimer').text("00:" + counter);
        }
        if (counter <= 0) {
            clearInterval(interval);
            $('#hTimer').text("--:--");
            $('#timerColor').removeClass("bg-warning");
            endGame();
            return;
        }
    }, 1000);
}

function badAnswer() {
    let badAnswerRand = Math.floor(Math.random() * 10);
    $("#hMessage").html(badAnswerArray[badAnswerRand]);
}

function userChoice(guess) {
    if (!gameDone) {
        if (guess == correctAnswerNum) {
            if (mQtype[questionNum] == 'D')
                $("#hMessage").html(`Correct, ${mxTra[questionNum]}`)
            else
                $("#hMessage").html(mxTra[questionNum]);
            $(".hrColor").css("border-top", "3px dashed green");
            correct++;
        } else {
            if (mQtype[questionNum] == 'D')
                $("#hMessage").html(`Not quite, ${mxTra[questionNum]}`)
            else
                badAnswer();
            $(".hrColor").css("border-top", "3px dashed red");
        }
        questionNum++;
    }

    if (questionNum == 10) {
        if (correct == 10)
            $("#hQuestion").html('<b>Wow, 100%, otherwise known as a perfect score</b>');
        else {
            percent = (correct / 10).toFixed(2) * 100;
            $("#hQuestion").html(`Your score: <b>${percent}%</b> - ${correct} out of 10 questions answered correctly`);
            $("#hCorrect").html(`<font color="green">correct = ${correct}</font>`);
        }
        gameDone = true;
        finGame();
    } else {
        renderQuestion(guess);
        if(timerSet)
            clearTimeout(handle);
        timerSet = true;
        timerHandle = setTimeout(clearmxTra, 3000);
    }
}

function logArrays() {
    console.log(movieSerList);
    console.log(movieSerArray);
    console.log(mTitleArray);
    console.log(mYearArray);
    console.log(mRatingArray);
    console.log(mPrimaryActor);
    console.log(mQtype);
    console.log(mQuestion);
    console.log(mAnswer);
    console.log(mxTra);
}

function playGame(genre, max, btnID) {
    initVars();
    genreID = btnID;
    $('.catbtns').prop("disabled", true);
    $('.catbtns').removeClass("btn-primary");
    $('.catbtns').addClass("btn-secondary");
    $('#btn-' + btnID).removeClass("btn-secondary");
    $('#btn-' + btnID).addClass("btn-primary");
    $('#progPanel').show();
    $("#hTimer").html("01:00");

    if (genre === "cat") {                                  // choose 'cat' or 'dog'
        randValue = Math.floor(Math.random() * 2);
        console.log(randValue);
        if (randValue)
            genre = "dog";
    }

    randValue = Math.floor(Math.random() * max) + 1;
    queryURL = "https://www.omdbapi.com/?s=" + genre + "&page=" + randValue + "&apikey=trilogy";  // pick a random page from 1..50

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (resp) {

        console.log(resp)
        for (let y = 0; y < 10; y++) {                              // build initial array of 10 imdbID's
            movieSerList.push(resp.Search[y].imdbID);
        }
        var innerIndex = 0;
        for (let x = 0; x < 10; x++) {                              // build other arrays necessary to dynamically build the questions list                           
            queryURL = "https://www.omdbapi.com/?i=" + movieSerList[x] + "&apikey=trilogy";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                movieSerArray.push(response.imdbID);
                mTitleArray.push(response.Title);
                mYearArray.push(response.Year);
                mRatingArray.push(response.imdbRating);
                mPrimaryActor.push(response.Actors);

                if (response.imdbRating < 5) {                      // first question type; type "R" which is ratings based and will be preferrd if the imdb rating is < 5
                    mQtype.push('R');
                    mQuestion.push("At least one of these movies is terrible.  Choose a movie from the list rated < 5 on imdb.org");
                    mAnswer.push(mTitleArray[innerIndex]);
                    mxTra.push("Who knew all of that binge-watching would lead to 'good'")
                } else {
                    randValue = Math.floor(Math.random() * 8);
                    switch (randValue) {
                        case 0:                                     // there is a 4 out of 8 chance that the question will draw upon the first Actor in the list of Actors
                        case 1:
                        case 2:
                        case 3:
                            var actors = response.Actors;
                            var pos = actors.search(',');

                            if (pos > 0) {
                                mQtype.push('A');
                                var actor = actors.substr(0, pos);
                                mQuestion.push("Choose a movie that stars <i>" + actor + "</i>");
                                mAnswer.push(response.Title);
                                mxTra.push("You are correct");
                                break;
                            } else {
                                if (actors != "N/A") {
                                    var actor = actors;
                                    mQtype.push('A+')
                                    mQuestion.push("Choose a movie that stars <i>" + actor + "</i>");
                                    mAnswer.push(response.Title);
                                    mxTra.push("You are correct");
                                    break;
                                } else
                                    randValue = 4;
                            }

                        case 4:                                     // in 2 out of 8 chances, type "D" or Decade question will be chosen
                        case 5:
                            mQtype.push('D');
                            mQuestion.push('Choose the decade that "' + response.Title + '" was released');
                            mAnswer.push(response.Year.substr(0, 3) + "0");
                            mxTra.push("this film was released in " + response.Year.substr(0, 4));
                            break;

                        case 6:
                        case 7:                                     // finally, there is a 2 out of 8 chance that the "F" or Fake algorithm will be chosen  If so, a random (1..5)
                            mQtype.push('F');                       // fake title is pulled from the array above, based on theme
                            mQuestion.push("Which of the following list of movie titles is fake");
                            mxTra.push("Great spot - from mile away");
                            randomValue = Math.floor(Math.random() * 5);
                            if (genre == "space")
                                mAnswer.push(fakeSpaceTitles[randomValue]);
                            if (genre == "dog")
                                mAnswer.push(fakeDogsTitles[randomValue]);
                            if (genre == "cat")
                                mAnswer.push(fakeCatsTitles[randomValue]);
                            if (genre == "pokemon")
                                mAnswer.push(fakePokemonTitles[randomValue]);
                            if (genre == "cowboy")
                                mAnswer.push(fakeCowboyTitles[randomValue]);
                            break;
                    }
                }
                if (mxTra.length < 10) {
                } else {
                    $("#hMessage").html("Welcome...");
                    renderQuestion();
                }
                innerIndex++
            })
        }
        $('#progPanel').hide();
        $('#questPanel').show();
        $('#msgPanel').show();
        gameDone = false;
        startTimer();
        $('#timerColor').removeClass("bg-warning");
        console.log("done");
        logArrays();
    })
}
