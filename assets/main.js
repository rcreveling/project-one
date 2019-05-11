var queryAllMembers = "https://api.propublica.org/congress/v1/115/senate/members.json";

// Congress api call
$.ajax({
url: queryAllMembers,
method: "GET",
beforeSend: function (xhr) { xhr.setRequestHeader('X-API-Key', '5bJZH4Np16Y8EZctNxL2tv9mCWirk0A1taulPeU8'); },
})
.then(function(response) {
      console.log(response)
      result = response.results[0];
      for (var i = 0; i < result.members.length; i++){
         name = result.members[i].first_name+" "+result.members[i].last_name;
         party = result.members[i].party;
         state = result.members[i].state;

         var newRow = $("<tr>").append(
               $("<td>").text(i+1),
               $("<td>").text(name),
               $("<td>").text(party),
               $("<td>").text(state)
         );

         $("#senateTable > tbody").append(newRow);
      }
});
