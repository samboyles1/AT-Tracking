//These two globals are used in all the functions
var googlemap = null;
var busMarker = null;

//setup is called automatically when googlemaps api is loaded
function setup() {
    //make the map just once
    initMap();
    //get the intial bus position 
    updateBusPosition();
    //refresh bus position every 30 secs(is in milliseconds)
    setInterval(updateBusPosition, 30000);
}


function initMap() {
    //this makes the map, centred in auckland(This point will get thrown away quickly when the bus moves)
    googlemap = new google.maps.Map(document.getElementById('mapdiv'), {
        zoom: 10,
        center: { lat: -36.848461, lng: 174.763336 }
    });

}
//Call the vehicle location api
//come back with the lat long of the one bus with id=3071
//move the global single marker to the new lat long of the bus
function updateBusPosition() {
    $.ajax({
        type: "GET",
        headers: { 'Ocp-Apim-Subscription-Key': '093a87b71c14401f9ae9b72c9ace16a9' },
        url: 'https://api.at.govt.nz/v2/public/realtime/vehiclelocations?vehicleid=3071', //get the data for vehicle 3071 - we know it exists
        dataType: 'json',
        success: function (data) {
            var busPosition = data.response.entity[0].vehicle.position;
            var busLatLng = { lat: busPosition.latitude, lng: busPosition.longitude };

            //make the one globl marker if it doesn't already exist
            if (busMarker == null) {
                busMarker = new google.maps.LatLng();
                busMarker.setMap(googlemap);
            }
            //move the marker to the new bus lat long
            busMarker.setPosition(busLatLng);
            
            //adjust the map so that the marker is in the middle of the map (will be zoomed in a lot with just one marker)
            //the map will zoom out to fit more markers if they were added to the bounds
            //this could be useful for multiple markers (https://stackoverflow.com/questions/1556921/google-map-api-v3-set-bounds-and-center?rq=1)
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(busMarker.position);
            googlemap.fitBounds(bounds);
        }

    });
}
