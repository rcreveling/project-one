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
    $('.scrollspy').scrollSpy();
    $('.modal').modal();

    var queryAllMembers = "https://api.propublica.org/congress/v1/115/senate/members.json";
    var allMembersArray = [];
    //BETH AJAX CALL//
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=2020 election&api-key=KdUok1bSMW9ZNypKxpRjEj4pEfLR6cAf";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.response.docs;
        console.log(results);
        for (i = 0; i < results.length; i++) {

            // if the news article contains an image...
            if (results[i].multimedia[0]) {
                console.log(results[i].headline.main);
                var imageSlider = $("<div>");
                imageSlider.attr("class", "fixed-action-btn");

                imageSlider = $("<li>");

                var linkSlider = $("<a>");
                linkSlider.attr("href", results[i].web_url);
                linkSlider.attr("class", "btn-floating blue");

                linkSlider.append("<i class='fa fa-link'></i>");




                var image = $("<img>");
                image.attr("src", "https://www.nytimes.com/" + results[i].multimedia[0].url);
                image.css({
                    height: "100%",
                    width: "auto",
                    boxSizing: "border-box",
                    borderTop: "2px solid blue",
                    borderBottom: "1px solid blue",
                    padding: "0px !important",
                    background: "no-repeat center center"
                });
                linkSlider.css({
                    position: "relative",
                    bottom: "7.5vh"
                })
                imageSlider.css({
                    backgroundColor: "linear-gradient(to right, rgb(220, 220, 230) rgb(220, 20, 30))"
                })
                imageSlider.append(image);

                
                imageSlider.append(linkSlider);


                $(".slides").append(imageSlider);
            } else {

            };

            $('.slider').removeClass('initialized');
            $('.slider').slider();

        };
    });
    //BETH AJAX CALL//
    // Congress api call
    $.ajax({
        url: queryAllMembers,
        method: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', '5bJZH4Np16Y8EZctNxL2tv9mCWirk0A1taulPeU8'); },
    }).then(function (response) {
        console.log(response)
        result = response.results[0];
        allMembersArray = result.members;
        console.log(allMembersArray)
        for (var i = 0; i < result.members.length; i++) {
            lastname = result.members[i].last_name;
            name = result.members[i].first_name + " " + result.members[i].last_name;
            party = result.members[i].party;
            state = result.members[i].state;
            indexVal = i;

            var newRow = $("<tr>").append(
                $("<td>").text(name),
                $("<td>").text(party),
                $("<td>").text(state),
                $("<td>")
            );

            newRow.attr('id', name)
            newRow.addClass("senatorDivision")
            var thisSenator = new Member(newRow.attr('id'))
            var modal = thisSenator.buildCardForMember(indexVal);
            console.log(modal, thisSenator)
            var modalTrigger = $("<button>", { class: "btn modal-trigger btn-floating btn-mall white-text black moreinfo" })
            modalTrigger.attr('data-target', lastname)
            modalTrigger.text("more")
            newRow.last().append(modal).append(modalTrigger)
            $('.modal').modal();

            $(".moreinfo").css({
                fontSize: ".5em",
            })
            switch (party) {
                case "R":
                    newRow.addClass("R")
                    $("#repTable > tbody").append(newRow);
                    break;
                case "I":
                    newRow.addClass("I")
                    $("#indTable > tbody").append(newRow);
                    break;
                case "D":
                    newRow.addClass("D")
                    $("#demTable > tbody").append(newRow)
                    break;
            }

        }
    })

    //BRENDA's WORK TO BE INTEGRATED//
    function allMembersQueryResponse(response) {
        // all members response
        console.log(response)
        // save off the senate members into an array
        allMembersArray = response.results[0].members;
        console.log("found all members array. The first name encountered is: " + allMembersArray[0].last_name);
    }
    function allMembersErrorResponse(error) {
        alert("An error was encountered when fetching the allMembers info: " + error);
    }

    // builds the all members query, sends it 
    function queryAllMembersAPI() {
        var queryAllMembers = "https://api.propublica.org/congress/v1/115/senate/members.json";
        console.log("queryAllMembersURL: " + queryAllMembers);

        $.ajax({
            // all members query
            url: queryAllMembers,
            method: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', '5bJZH4Np16Y8EZctNxL2tv9mCWirk0A1taulPeU8'); },
        })
            .then(allMembersQueryResponse)
            .catch(allMembersErrorResponse);
    }
    class Member {
        constructor(nameStr) {
            var nameArray = nameStr.split(" ");
            this.lastName = nameArray[1];
            this.firstName = nameArray[0];

            // find our senator
            for (var i = 0; i < allMembersArray.length; i++) {
                // console.log( 'index is: ' + i);
                // console.log('last name is: ' + response.results[0].members[i].last_name + " id is: " + response.results[0].members[i].id); 
                var searchLastName = allMembersArray[i].last_name;

                // bjt need to handle case of two members with the same last name
                // need to search on first name and last name
                // and with middle names
                // and handle the case - its case sensitive right now
                if (searchLastName === this.lastName) {
                    console.log('success');
                    this.memberId = allMembersArray[i].id;
                    this.state = allMembersArray[i].state;
                    var party = allMembersArray[i].party;
                    this.party = party === 'R' ? 'Republican' : party === 'D' ? 'Democrat' : 'Independent';
                    this.fecId = allMembersArray[i].fec_candidate_id;

                    console.log('member id is: ' + this.memberId);
                    break;
                }
            }
        } // end constructor

        buildCardForMember(indexVal) {
            var thisOne = allMembersArray[indexVal]
            console.log(thisOne)
            var newModal = $("<div>", { class: "modal", id: thisOne.last_name })
            var newModalContent = $("<div>", { class: "modal-content", id: "" })
            var newModalFooter = $("<div>", { class: "modal-footer", id: "" })
            newModalContent.html(function () {
                var header = ("<h1>" + thisOne.title + " " + thisOne.first_name + " " + thisOne.last_name + "</h1> <br>")
                var information = (
                    ("<h4> State: " + thisOne.state + "</h4> <br>") +
                    ("<h4> Party: " + thisOne.party + "</h4> <br>") +
                    ("<h4> Website: " + "<a class='memberLink' href='https://www." + thisOne.last_name + ".senate.gov' target='_blank'>" + thisOne.first_name + " " + thisOne.last_name + "</a> </h4> <br>") +
                    ("<h5> <a class='memberLink' href='http://bioguide.congress.gov/scripts/biodisplay.pl?index=" + thisOne.id + " target='_blank'>Biographical Information</a> </h4> <br>")
                )
                return (header + information);
            })
            var themeImage = $("<img>");
            themeImage.attr('src', 'https://theunitedstates.io/images/congress/225x275/' + thisOne.id + '.jpg');
            themeImage.attr('alt', 'Senator ' + thisOne.first_name + ' ' + thisOne.last_name);
            newModalContent.css({
                textAlign: "left",
                backgroundImage: "url(assets/images/full-bloom.png)",
                backgroundRepeat: "infinite",


            })
            newModalFooter.css({
                backgroundColor: "black",
            })
            themeImage.css({
                float: "right",
                position: "relative",
                top: "-50vh",
                right: "10px",
                border: "solid 2px black",
                boxShadow: "0px 0px 1px 3px black",
                maxHeight: "20vh",
                width: "auto",
            })
            newModal.append(newModalContent).append(themeImage).append(newModalFooter)

            return newModal;
        }
        static getCampaignFinanceQuery(response) {
            console.log(response.results);
            var disbursements = response.results[0].total_disbursements;
            if (disbursements === 0) {
                // nothing reported
                return;
            }
            var contributions = response.results[0].total_contributions;
            var individuals = response.results[0].total_from_individuals;
            var pacs = response.results[0].total_from_pacs;

            // find the year for the response
            var dateArray = response.results[0].date_coverage_to.split('-');
            var year = dateArray[0];
            var disbursementHtml = '<br><b>Disbursements (' + year + '): </b>' + disbursements;
            var contributionsHtml = '<br><b>Contributions (' + year + '): </b>' + contributions;
            var individualsHtml = '<br><b>From Individuals (' + year + '): </b>' + individuals;
            var pacsHtml = '<br><b>From PACs (' + year + '): </b>' + pacs;
            // find the last name of this senator so you can find the id in the html
            var nameStr = response.results[0].name;
            var nameArray = nameStr.split(',');
            var idName = "#" + nameArray[0].toUpperCase();
            $(idName).append(contributionsHtml);
            $(idName).append(disbursementHtml);
            $(idName).append(individualsHtml);
            $(idName).append(pacsHtml);
        }
        // fec.gov api query response handling
        fecQueryResponse(response) {
            // because we are in a callback there is no 'this', and no way to tell which senator had the error
            console.log('fec query response');
            console.log(response);
            if (response.status !== 'OK') {
                console.log('An error in campaign Finance Query Response');
                console.log(response);
                return;
            }
        }


        // propublica api query response handling
        campaignFinanceQueryResponse(response) {
            // because we are in a callback there is no 'this', and no way to tell which senator had the error
            if (response.status !== 'OK') {
                console.log('An error in campaign Finance Query Response');
                console.log(response);
                return;
            }
            Member.getCampaignFinanceQuery(response);
        }

        campaignFinanceQueryError(error) {
            // because we are in a callback there is no 'this', and no way to tell which senator had the error
            console.log('campaign finance query hit an error: ' + error);
        }

        // builds the campaign finance query for 2016 and 2018, sends it, processes and displays the results
        queryCampaignFinancesAPI() {
            var campaingFinanceApiKey = 'nSWxGCi8m5TJ7ma1XtjxUyj5lkenTTrYnUM947va';
            var query2016FinanceData = "https://api.propublica.org/campaign-finance/v1/2016/candidates/" + this.fecId + ".json";

            console.log("query2016FinanceData: " + query2016FinanceData);

            $.ajax({
                // campaign finance query 2016
                url: query2016FinanceData,
                method: "GET",
                beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', campaingFinanceApiKey); },
            })
                .then(this.campaignFinanceQueryResponse)
                .catch(this.campaignFinanceQueryError);

            // now do the 2018 api call
            var query2018FinanceData = "https://api.propublica.org/campaign-finance/v1/2018/candidates/" + this.fecId + ".json";
            $.ajax({
                // campaign finance query 2018
                url: query2018FinanceData,
                method: "GET",
                beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', campaingFinanceApiKey); },
            })
                .then(this.campaignFinanceQueryResponse)
                .catch(this.campaignFinanceQueryError);
            /*
                    // http://api.open.fec.gov/v1/candidate/{candidate_id}/history
                    // warren committee for president C00693234 warren P00009621
                    // https://www.fec.gov/data/candidate/P00009621/?cycle=2020&election_full=false
                    // obama P80003338
                    var fecAPIKey = 'i24dHGikX6D7nn8ilW0yct1WdE67QI6udYyNJ8J8';
                    // curl -X GET "https://api.open.fec.gov/v1/candidates/search/?office=P&page=1&sort=name&sort_nulls_last=false&per_page=20&candidate_status=C&cycle=2020&sort_null_only=false&api_key=" + fecAPIKey + "&sort_hide_null=true" -H "accept: application/json"
                    //var fecQuery = 'http://api.open.fec.gov/v1/candidate/P00009621/?cycle=2020&election_full=false&api_key=i24dHGikX6D7nn8ilW0yct1WdE67QI6udYyNJ8J8';
                    // president 2020var fecQuery = 'http://api.open.fec.gov/v1/candidates/?cycle=2020&office=P&candidate_status=C&api_key=' + fecAPIKey;
                    var fecQuery = 'http://api.open.fec.gov/v1/candidates/?cycle=2018&office=S&per_page=65&candidate_status=C&api_key=' + fecAPIKey;
            
            
            
                    // history of candidate'http://api.open.fec.gov/v1/candidate/P00009621/history?api_key=i24dHGikX6D7nn8ilW0yct1WdE67QI6udYyNJ8J8';
            
                    $.ajax({
                        // fec.gov query
                        url: fecQuery,
                        method: "GET",
                    })
                    .then(this.fecQueryResponse)
                    .catch(this.campaignFinanceQueryError);
                
                    var fecQueryPage2 = 'http://api.open.fec.gov/v1/candidates/?cycle=2018&office=S&per_page=65&page=2&candidate_status=C&api_key=' + fecAPIKey;
                    $.ajax({
                        // fec.gov query
                        url: fecQueryPage2,
                        method: "GET",
                        //beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', campaingFinanceApiKey); },
                    })
                    .then(this.fecQueryResponse)
                    .catch(this.campaignFinanceQueryError);
            */
        }

        // define all getters and setters here
        get memberLastName() { return this.lastName; }
        set memberLastName(name) { this.lastName = name; }
        get memberFirstName() { return this.firstName; }
        set memberFirstName(name) { this.firstName = name; }
        get memberIdentifier() { return this.memberId; }
        set memberIdentifier(id) { this.memberId = id; }

    }
});
