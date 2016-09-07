$('document').ready(function() {

  $("#panel-poidetail").panel("open", 123);

  console.log("I'm in the app.js file");
  // $.ajaxSetup ({
  //   cache: false
  // });

  function loadMapListPage() {
    $('#main').load('../ArchitectWorld/map-list.html', function() {

      function renderMaps(maps) {
        $('#map-list').empty();
        for( var i = 0; i < maps.length; i++ ) {
          console.log("I'm in the for loop for getting maps");
          $('#map-list').append(`<li><a href="#">${maps[i].name}</a></li>`);
        }
      }
      $.ajax({
        url: "https://protected-anchorage-46542.herokuapp.com/users/2/games/",
        dataType: "JSON",
        type: "GET",
        error: function(err) {
          console.log("maps list request failed");
        },
        success: function(response) {
          console.log("maps list request successful");
          renderMaps(response);
        }
      })
    })
  }

  loadMapListPage();

})
