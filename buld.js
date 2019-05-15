class Member {
    constructor(nameStr) {
        var nameArray = nameStr.split(" ");
        this.lastName = nameArray[1];
        this.firstName = nameArray[0];

        //FIND SENATOR//
        for (var i = 0; i < allMembersArray.length; i++) {
            var searchLastName = allMembersArray[i].last_name;
            if (searchLastName === this.lastName) {
                this.memberId = allMembersArray[i].id;
                this.state = allMembersArray[i].state;
                var party = allMembersArray[i].party;
                this.party = party === 'R' ? 'Republican' : party === 'D' ? 'Democrat' : 'Independent';
                this.fecId = allMembersArray[i].fec_candidate_id;

                console.log('member id is: ' + this.memberId);
                console.log('member FEC id is: ' + this.fecId)
                break;
            }
        }
    }







}

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
        name = result.members[i].first_name + " " + result.members[i].last_name;
        party = result.members[i].party;
        state = result.members[i].state;
        var newModal = $("<div>", { class: "modal", id: name })
        var newModalContent = $("<div>", { class: "modal-content", id: "" })
        var newModalFooter = $("<div>", { class: "modal-footer", id: "" })
        newModal.append(newModalContent, newModalFooter)
        var newRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(party),
            $("<td>").text(state),
            $("<td>").html("<button class='btn-floating btn-small black white-text moreinfo modal-trigger'>" + "more" + "</button>")
        );
        newRow.last().addClass("modalLocation")
        $(".modalLocation").append(newModal)

        newRow.attr('id', name)
        newRow.addClass("senatorDivision")
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
    $(".moreinfo").on("click", function () {
        console.log($(this).parent().parent().attr('id'));
        // create a Member class, save it in the senators array
        // this gives each senator it's own data and queries 
        // so that there will be no overwriting of info between senators
        var thisSenator = new Member($(this).parent().parent().attr('id'));
        // display the intial senator info 
        // - all of this data comes from the all members search done on startup
        thisSenator.buildCardForMember();
        // now query for campaign data for the years in question
        thisSenator.queryCampaignFinancesAPI();
    });
});