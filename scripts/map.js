//These two globals are used in all the functions
var googlemap = null;
var busMarker = null;

/**
 * called automatically when the googlemaps api is loaded
 */
function setup() {
    //make the map just once
    initMap();
    //get the intial bus position 
    updateBusPosition();
    //refresh bus position every 30 secs(is in milliseconds)
    //setInterval(updateBusPosition, 30000);
}


/**
 * initialises the map
 */
function initMap() {
    //this makes the map, centred in auckland(This point will get thrown away quickly when the bus moves)
    googlemap = new google.maps.Map(document.getElementById('mapdiv'), {
        zoom: 10,
        center: { lat: -36.848461, lng: 174.763336 }
    });

}

/**
 * calls the vehicle location api and returns a lat long for a single bus
 * moves marker to location of new lat lon of bus
 */
function updateBusPosition() {
    $.ajax({
        type: "GET",
        headers: { 'Ocp-Apim-Subscription-Key': '093a87b71c14401f9ae9b72c9ace16a9' },
        url: 'https://api.at.govt.nz/v2/public/realtime',
        dataType: 'json',
        success: function (data) {
            var vehicles = [];
            var entities = data.response.entity;
            entities.forEach(function (e) {
                if (e.vehicle && e.vehicle.trip && e.vehicle.trip.route_id == selected_route_id) {
                    vehicles.push({ 'vehicle_id': e.vehicle.vehicle.id, 'latitude': e.vehicle.position.latitude, 'longitude': e.vehicle.position.longitude });
                }
            });

            var infoWindow = new google.maps.InfoWindow({
                content: busInfoString
            });

            //The api returns the vehicles for ALL the active routes. 
            //The forEach loop then just selects the route you asked for (selected_route_id)

            //move the marker to the new bus lat long
            busMarker.setPosition(busLatLng);
            busMarker.setMap(googlemap);
            busMarker.addListener('click', function() {
               infoWindow.open(googlemap, busMarker)
            });
            //adjust the map so that the marker is in the middle of the map (will be zoomed in a lot with just one marker)
            //the map will zoom out to fit more markers if they were added to the bounds
            //this could be useful for multiple markers (https://stackoverflow.com/questions/1556921/google-map-api-v3-set-bounds-and-center?rq=1)
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(busMarker.position);
            googlemap.fitBounds(bounds);
        }

    });
}
