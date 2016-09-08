$(document).ready(function() {

  var getMapsRequest = $.ajax({
    url: "https://protected-anchorage-46542.herokuapp.com/users/2/games/",
    type: "GET",
    dataType: "JSON"
  });

  getMapsRequest.done(function(response) {
    console.log(response);
    getMaps(response);
  });

  getMapsRequest.fail(function(response) {
    console.log("maps list request failed")
  })
});

function getMaps(response) {
  for (var i = 0; i < response.length; i++ ) {
    $("#map-list").append(`<li><a href="#">${response[i].name}</a></li>`)
  }
  console.log("here will be the logic to print out the maps")
}
