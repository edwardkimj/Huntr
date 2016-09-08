$(document).ready(function() {

  $("#panel-poidetail").panel("open", 123);

  console.log("I'm in the app.js file");
  $.ajaxSetup ({
    cache: false
  });

  function loadMapListPage() {
    function renderMaps(maps) {
      $('#map-list').empty();
      for( var i = 0; i < maps.length; i++ ) {
        console.log("I'm in the for loop for getting maps");
        $('#map-list').append(`<li><a  href="/#maps/${maps[i].id}">${maps[i].name}</a></li>`);
        listenForClick();
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
  };

  function loadMapDetailPage(mapId) {
    $('#main').load('../ArchitectWorld/map-details.html', function() {
      console.log("I'm in the load map detail page function");
    });
  }


  function setView() {
    console.log("I'm in setView!!!")
    var hashParts = document.location.hash.split('/');
    if (hashParts[0] === '') {
      console.log("i'm in the setView and about to load the maplist page")
      loadMapListPage();
    } else {
      console.log("i'm in setview and i'm trying to go to details")
      loadMapDetailPage(hashParts[1]);
    }
  }

  $('#map-list a').on('tap', function(event) {
      event.preventDefault();
      // grab href with the maps id
      // clear out the html page and inject details of maps
      console.log("clicked on map-quest link")
  })

  setView();

  window.addEventListener('hashchange', setView);
});


function listenForClick() {
  $('#map-list').on('click', 'a', function(event) {
    event.preventDefault();
    // grab href with the maps id
    // clear out the html page and inject details of maps
    console.log("clicked on map-quest link")
  });
};


//if (hashParts[0] === '#maps' && hashParts[1]) {
