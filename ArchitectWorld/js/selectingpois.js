var ServerInformation = {
    POIDATA_SERVER: "https://protected-anchorage-46542.herokuapp.com/users/2/games/1/steps",
    POIDATA_SERVER_ARG_LAT: "lat",
    POIDATA_SERVER_ARG_LON: "lon",
    POIDATA_SERVER_ARG_NR_POIS: "nrPois"
};

var World = {
    
	cisRequestingData: false,
	initiallyLoadedData: false,

	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,
    sock: null,

	markerList: [],
	currentMarker: null,
    
    createMarker: function createMarkerFn(specificPoi) {
        World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
        World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
        return new Marker(specificPoi);
    },
    
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
//		World.markerList = [];
        
        console.log(poiData);
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

        var pois = [];
        var that = this;

		for (var currentPlaceNr = 1; currentPlaceNr < poiData.length ; currentPlaceNr++) {
			var poi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description,
                onClose: function() {
                    if (pois.length === 0) {
                        return alert('Congratz!');
                    }
                    
                    console.log("outside of checkIfUserIsClose function:");
                    (function checkIfUserIsClose() {
                     //            // If distance from a user and a marker is small, then call the "onClose" function
                     //                // return ...
                     //            // Otherwise check it again in 5s.
                     setTimeout(function() {
                                var currentMarkerLon = World.currentMarker.poiData.longitude;
                                var currentMarkerLat = World.currentMarker.poiData.latitude;
                                var myGeoLocation = new AR.GeoLocation(currentMarkerLat, currentMarkerLon);
                                var distance = myGeoLocation.distanceToUser();
                                console.log(myGeoLocation);
                                console.log(distance);
                                checkIfUserIsClose();
                                }, 2000);
                     })();
                    World.currentMarker = World.createMarker(pois.shift());
                    World.markerList = [World.currentMarker];
                }
			};
            pois.push(poi);
            
		}
        World.currentMarker = World.createMarker(pois.shift());
//        var myGeoLocation = new AR.GeoLocation(37.784985, -122.398508);
//        var distance = myGeoLocation.distanceToUser();
//        
//        console.log(distance);
        
        World.markerList = [World.currentMarker];

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


		if (!World.initiallyLoadedData) {

			World.requestDataFromServer(lat, lon);
			World.initiallyLoadedData = true;
            
		}
	},

//	// fired when user pressed maker in cam
//	onMarkerSelected: function onMarkerSelectedFn(marker) {
//
//		// deselect previous marker
//		if (World.currentMarker) {
//			if (World.currentMarker.poiData.id == marker.poiData.id) {
//				return;
//			}
//			World.currentMarker.setDeselected(World.currentMarker);
//		}
//
//		// highlight current one
//		marker.setSelected(marker);
//		World.currentMarker = marker;
//        
//	},
        
    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.currentMarker = marker;
        console.log(marker);

        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);
        
        $("#poi-resolved").click(function() {
            $("#panel-poidetail").panel("close");
            marker.markerObject.destroy();
            World.currentMarker = null;
            World.markerList = [];
            marker.poiData.onClose();
        });
//        console.log("outside of checkIfUserIsClose function:");
//        (function checkIfUserIsClose() {
////            // If distance from a user and a marker is small, then call the "onClose" function
////                // return ...
////            // Otherwise check it again in 5s.
//         console.log("Wasup");
//            setTimeout(function() {
//                       console.log("Hello");
//                       checkIfUserIsClose();
//            }, 2000);
//        })();
        
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

AR.context.onLocationChanged = World.locationChanged;

AR.context.onScreenClick = World.onScreenClick;