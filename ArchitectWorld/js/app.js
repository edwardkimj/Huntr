$(document).ready(function() {

  $("#panel-poidetail").panel("open", 123);

  $.ajaxSetup ({
    cache: false
  });

  function loadMapListPage() {
    function renderMaps(maps) {
      $('#map-list').empty();
      for( var i = 0; i < maps.length; i++ ) {
        console.log("I'm in the for loop for getting maps");
        $('#map-list').append(`<li><a href="#" data-id="${maps[i].id}">${maps[i].name}</a></li>`);
      }
      listenForClick();
      $('.hunts').show();
      $('.hunt-detail').hide();
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

  loadMapListPage();
});


function listenForClick() {
  console.log('listenForClick');
  var test = $('#map-list').on('click', 'a', function(event) {
    console.log('listenForClick CLICKED');
    event.preventDefault();
    console.log('CURRENT MAP ID');
    console.log($(this).data('id'));
    $('#current-map').data('id', $(this).data('id'));
    $('.hunts').hide();
    $('.hunt-detail').show();
    $("#panel-poidetail").panel("close");
    $.getScript("js/selectingpois.js");
    $.getScript("js/marker.js");
  });
};
