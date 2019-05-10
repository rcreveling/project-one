$(document).ready(function () {
    $('.slider').slider();
});


$.ajax({
    url: "https://api.propublica.org/congress/v1/115/senate/members.json",
    method: "GET",
    beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', '6mRMj8xXOk6ZHH35ST73YuTmfTjHf2JDGY8jx7GN'); },
}).then(function (response) {
    console.log(response)
})