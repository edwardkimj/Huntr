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
    
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		World.markerList = [];

		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

        var markers = [];
        var that = this;

		for (var currentPlaceNr = 1; currentPlaceNr < poiData.length ; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description,
                onClose: function() {
                    if (markers.length === 0) {
                        alert('Congratz!');
                        World.sock = new AR.ImageResource("assets/dirtysock1.png");
                        console.log(World.sock);
                        return World.sock;

                    }
                    var currentMarker = markers.shift();
                    World.markerList = [currentMarker];
                    World.currentMarker = currentMarker;
                }
			};
            
            markers.push(new Marker(singlePoi));
		}
        
        World.markerList = [markers.shift()];

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
            World.loadPoisFromJsonData(data);
                              console.log(data);
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