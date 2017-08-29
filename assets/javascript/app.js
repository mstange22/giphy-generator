var topic;
var queryURL;
var results;
var rating;
var imgDiv;
var topicImg;
var state = "still";
var searchTerms = [ "armadillo", "honey badger", "gorilla", "shark",
                    "stingray", "whale", "cheetah", "tiger", "bear" ];
var newBtn;
var newSearchTerm;

var sound = new Audio();
sound.src = "assets/audio/pop.wav";

function addButtons() {

    $("#btn-div").html("");

    for(var i = 0; i < searchTerms.length; i++) {
        newBtn = $("<button>");
        newBtn.addClass("btn btn-primary btn-sm topic-btn");
        newBtn.text(searchTerms[i]);
        $("#btn-div").append(newBtn);
    }
}

$(document).ready(function() {

    addButtons();

});

$(document).on("click", ".topic-btn", function() {

    topic = $(this).text();

    // replace spaces with +
    if(topic.includes(" ")) {

        topic = topic.replace(/ /g, "+");
    }
      
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    topic + "&api_key=cae50eb25c8f468c83e3875b6fa5d3a4&limit=10";

    $.ajax( { url: queryURL, method: "GET" } ).done(function(response) {

        results = response.data;

        $("#images-container").html("<h2>Click on an image to toggle animation</h2>");
        $("#images-container").append("<h3>(some animations may take a few seconds to load)</h3>");

        for (var i = 0; i < results.length; i++) {

            rating = $("<p>");
            rating.attr("class", "rating")
            rating.text("Rating: " + results[i].rating);
            
            topicImg = $("<img>");
            topicImg.attr({ "class": "topic-img",
                            "state": "still",
                            "src": results[i].images.fixed_height_still.url,
                            "still-url": results[i].images.fixed_height_still.url,
                            "animate-url": results[i].images.fixed_height.url });

            imgDiv = $("<div>");
            imgDiv.addClass("img-div");
            imgDiv.append(topicImg, rating);

            $("#images-container").append(imgDiv);
        }
    });
});

// on-click event handler to toggle animation
$(document).on("click", ".topic-img", function() {

    state = $(this).attr("state");

    if(state === "still") {

        $(this).attr("src", $(this).attr("animate-url"));
        $(this).attr("state", "animate");
    }

    if(state === "animate") {

        $(this).attr("src", $(this).attr("still-url"));
        $(this).attr("state", "still");
    }
});

// on-click event handler to submit added search term
$(document).on("click", "#submit", function(event) {

    event.preventDefault();

    newSearchTerm = $("#search-term").val();

    if(newSearchTerm !== "") {

        searchTerms.push(newSearchTerm);

        addButtons();

        $("#search-term").val("");
    }

});

// on-click event handler to submit added search term
$(document).on("click", "#pop", function(event) {

    event.preventDefault();

    if(searchTerms.length > 0) {

        sound.play();
        searchTerms.pop();
        addButtons();
    }
});