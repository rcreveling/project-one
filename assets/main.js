$(document).ready(function () {
    $('.slider').slider();
    // function for next slide
    $('.next').click(function () {
        $('.slider').slider('next');
    });

    // function for prev slide
    $('.prev').click(function () {
        $('.slider').slider('prev');
    });


});




$.ajax({
    url: "https://api.propublica.org/congress/v1/115/senate/members.json",
    method: "GET",
    beforeSend: function (xhr) {
        xhr.setRequestHeader('X-API-Key', '6mRMj8xXOk6ZHH35ST73YuTmfTjHf2JDGY8jx7GN');
    },
}).then(function (response) {
    console.log(response)
})

// constructing a queryURL variable we will use instead of the literal string inside of the ajax method

var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=2020 election&api-key=KdUok1bSMW9ZNypKxpRjEj4pEfLR6cAf";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    var results = response.response.docs;

    for (i = 0; i < results.length; i++) {


        if (results[i].multimedia[0]) {

            console.log(results[i].multimedia[0].url);
            console.log(results[i].web_url);


            var imageSlider = $("<div>");
            imageSlider.attr("class", "fixed-action-btn");
            
             imageSlider = $("<li>");

            var linkSlider = $("<a>");
            linkSlider.attr("href", results[i].web_url);
            linkSlider.attr("class", "btn-floating blue");
            var floatingButton = $("<i>");
         //   floatingButton.attr("class", "far fa-file");
            
            
           
            imageSlider.append(linkSlider);
            imageSlider.append(floatingButton);
            var image = $("<img>");
            image.attr("src", "https://www.nytimes.com/" + results[i].multimedia[0].url);

            imageSlider.append(image);

            $(".slides").append(imageSlider);
        } else {

        };

        $('.slider').removeClass('initialized');
        $('.slider').slider();

    };
});