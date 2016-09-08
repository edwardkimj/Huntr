function getMapLink() {
  var mapId = $('#current-map').data('id');
  var link = "https://protected-anchorage-46542.herokuapp.com/users/2/games/" + mapId + "/steps";
  console.log('getMapLink()');
  console.log(link);
  return link;
}

var ServerInformation = {
    POIDATA_SERVER: getMapLink(),
    POIDATA_SERVER_ARG_LAT: "lat",
    POIDATA_SERVER_ARG_LON: "lon",
    POIDATA_SERVER_ARG_NR_POIS: "nrPois"
};

var SockWorld = {
    loaded: false,
    rotating: false,

    init: function initFn() {
        this.createModelAtLocation();
    },

    createModelAtLocation: function createModelAtLocationFn() {

    /*
     First a location where the model should be displayed will be defined. This location will be relativ to the user.
     */
        var location = new AR.RelativeLocation(null, 5, 0, 2);

    /*
     Next the model object is loaded.
     */
        var modelEarth = new AR.Model("assets/huntr-dirtysock.wt3", {
                                  onLoaded: this.worldLoaded,
                                  scale: {
                                  x: 2,
                                  y: 2,
                                  z: 2
                                  },
                                  rotate: {
                                  roll: 180.0,
                                  tilt: 0.0,
                                  heading: 0.0
                                  },

                                  translate: {
                                  x: 5,
                                  y: 5,
                                  z: 0
                                  }
                                  });

        var indicatorImage = new AR.ImageResource("assets/indi.png");

        var indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
                                                 verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
                                                 });

    /*
     Putting it all together the location and 3D model is added to an AR.GeoObject.
     */
        var obj = new AR.GeoObject(location, {
                               drawables: {
                               cam: [modelEarth],
                               indicator: [indicatorDrawable]
                               }
                               });
    },

    worldLoaded: function worldLoadedFn() {
        SockWorld.loaded = true;
        var e = document.getElementById('loadingMessage');
        e.parentElement.removeChild(e);
    }
};

var World = {


    // ----------------------------------- POIS CODE ______________________________
	cisRequestingData: false,
	initiallyLoadedData: false,

	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,
    sock: null,

	markerList: [],
	currentMarker: null,
    pois: [],
    logs: [],

    // ----------------------------------- GEO CODE ------------------------------------
//    loaded: false,
//    rotating: false,
//
//    init: function initFn() {
//    this.createModelAtLocation();
//    },
//
//    createModelAtLocation: function createModelAtLocationFn() {
//
//    /*
//     First a location where the model should be displayed will be defined. This location will be relativ to the user.
//     */
//        var location = new AR.RelativeLocation(null, 5, 0, 2);
//
//    /*
//     Next the model object is loaded.
//     */
//        var modelEarth = new AR.Model("assets/huntr-dirtysock.wt3", {
//                                  onLoaded: this.worldLoaded,
//                                  scale: {
//                                  x: 2,
//                                  y: 2,
//                                  z: 2
//                                  },
//                                      rotate: {
//                                      roll: 180.0,
//                                      tilt: 0.0,
//                                      heading: 0.0
//                                      },
//
//                                      translate: {
//                                      x: 5,
//                                      y: 5,
//                                      z: 0
//                                      }
//                                  });
//
//        var indicatorImage = new AR.ImageResource("assets/indi.png");
//
//        var indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
//                                                 verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
//                                                 });
//
//    /*
//     Putting it all together the location and 3D model is added to an AR.GeoObject.
//     */
//        var obj = new AR.GeoObject(location, {
//                               drawables: {
//                               cam: [modelEarth],
//                               indicator: [indicatorDrawable]
//                               }
//                               });
//    },
//
//    worldLoaded: function worldLoadedFn() {
//        World.loaded = true;
//        var e = document.getElementById('loadingMessage');
//        e.parentElement.removeChild(e);
//    },
//
    // ----------------------------------- END OF GEO CODE -------------------------------

    createMarker: function createMarkerFn(specificPoi) {
        World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
        World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
        return new Marker(specificPoi);
    },

//    createTreasure: function createTreasureFn() {
//        World.sock = new AR.imageResource("assets/dirtysock1.png");
    // hard code a geolocation
    // use the location to put it into a geoObject
    //
//
//    }

    // recursive check for user proximity to marker
    checkIfUserIsNearMarker: function() {
        console.log('Inside checkIfUserIsNearMarker, World: ', World)
        var markerLocation = new AR.GeoLocation(World.currentMarker.poiData.latitude, World.currentMarker.poiData.longitude);
        console.log("Marker Location:");
        console.log(markerLocation);
        var distance = markerLocation.distanceToUser();
        var msg = "this is the distance between the user and the marker: "  + distance;
        $('#poi-detail-distance').html(distance);
        World.logs.push(msg);
        console.log(msg);
        console.log(World.logs);

        if(distance < 50) {
            return World.tryLoadNextMarker();
        }

        setTimeout(function() {
            console.log('setTimeout called');
            World.checkIfUserIsNearMarker();
        }, 3000);
    },

    // tries to create a new marker based on distance to user
    tryLoadNextMarker: function() {
        console.log('inside tryLoadNextMarker');
        World.currentMarker.markerObject.destroy();
        World.currentMarker = null;
        World.markerList = [];
//        World.sock = new AR.imageResource("assets/dirtysock1.png");

        if (World.pois.length === 0) {
            alert("You found the treasure!! Click 'OK' to redeem your prize! ");
            SockWorld.init();
//            var sockImage = new AR.imageDrawable(World.sock, 5, {
//                zOrder: 0,
//                opacity: 1.0
//                });

//            return sockImage;

//            return

        }

        World.currentMarker = World.createMarker(World.pois.shift());
        World.markerList = [World.currentMarker];
        World.checkIfUserIsNearMarker();
    },

    // loads POIs from JSON data and runs check to see if user is near
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

        World.pois = [];
        var that = this;

        // DONT FORGET TO CHANGE BACK TO 0
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length ; currentPlaceNr++) {
			var poi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description,
                onClose: function() {
//                    World.tryLoadNextMarker();
                }
			};
            World.pois.push(poi);

		}
        World.currentMarker = World.createMarker(World.pois.shift());


        World.markerList = [World.currentMarker];
        World.checkIfUserIsNearMarker();

		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},

	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	locationChanged: function locationChangedFn(lat, lon, alt, acc) {
        console.log('current lat ' + lat);
        console.log('current lon ' + lon);


		if (!World.initiallyLoadedData) {

			World.requestDataFromServer(lat, lon);
			World.initiallyLoadedData = true;

		}
	},

    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.currentMarker = marker;

        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);

        $("#poi-resolved").click(function() {
            $("#panel-poidetail").panel("close");
            marker.poiData.onClose();
        });


        var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");

        $("#poi-detail-distance").html(distanceToUserValue);

        $("#panel-poidetail").panel("open", 123);

        $(".ui-panel-dismiss").unbind("mousedown");

        $("#panel-poidetail").on("panelbeforeclose", function(event, ui) {
            $("#poi-resolved").unbind('click');
            World.currentMarker.setDeselected(World.currentMarker);
        });
    },

	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

    requestDataFromServer: function requestDataFromServerFn(lat, lon) {

        World.isRequestingData = true;
        World.updateStatusMessage('Requesting places from web-service');
        var serverUrl = ServerInformation.POIDATA_SERVER + "?" + ServerInformation.POIDATA_SERVER_ARG_LAT + "=" + lat + "&" + ServerInformation.POIDATA_SERVER_ARG_LON + "=" + lon + "&" + ServerInformation.POIDATA_SERVER_ARG_NR_POIS + "=20";

        var jqxhr = $.getJSON(serverUrl, function(data) {
            World.markerList = data;
            World.loadPoisFromJsonData(data);
            World.isRequestingData = false;
        })

        .error(function(err) {

            World.updateStatusMessage("Invalid web-service response.", true);
            World.isRequestingData = false;
        });
	}
};
//SockWorld.init();

AR.context.onLocationChanged = World.locationChanged;

AR.context.onScreenClick = World.onScreenClick;
