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
    beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', '6mRMj8xXOk6ZHH35ST73YuTmfTjHf2JDGY8jx7GN'); },
}).then(function (response) {
    console.log(response)
})
