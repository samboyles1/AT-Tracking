//These two globals are used in all the functions

var googlemap = null;

var selected_route_id = null;

var markers = [];

var api_url = 'https://api.at.govt.nz/v2/';
var api_header = { 'Ocp-apim-Subscription-key': '093a87b71c14401f9ae9b72c9ace16a9' };


// called automatically when the googlemaps api is loaded

function setup() {
    //this makes the map, centred in auckland(This point will get thrown away quickly when the bus moves)
    googlemap = new google.maps.Map(document.getElementById('mapdiv'), {
        zoom: 10,
        center: { lat: -36.848461, lng: 174.763336 }
    });
}

/**
When the document is first loaded, get all the current routes and add them as options in the route select list
*/
$(document).ready(function () {
    loadCurrentRoutes();
});



/**
 * As soon as the document has loaded ask the api for ALL possible current routes
 */
function loadCurrentRoutes() {
    $.ajax({
        type: "GET",
        headers: api_header,
        url: api_url + 'public/realtime',
        dataType: 'json',
        success: function (data) {
            var entities = data.response.entity;
            entities.forEach(function (e) {
                if (e.vehicle && e.vehicle.trip) {
                    var routeName = getRouteName(e.vehicle.trip.route_id);
                    $('#routeSelector').append(new Option(routeName, e.vehicle.trip.route_id));
                }
            });
            $(".select-style").slideToggle();
            $(".spinner").fadeOut(100);
        }
    });
}

function getRouteName(route_id) {
    var route = dbRoutes.find(function (r) {
        return r.id == route_id;
    });
    return route ? route.route_name : (route_id + ' not found');
}

function setSelectedRoute(value) {
    selected_route_id = value;
    updateBusPositions();
    $(".select-style").animate({top: "12%"}, 350);
    $("#mapdiv").fadeIn(1000);
    $("#selectorTitle").fadeOut(200);
    refreshMapOnDisplay();
    setInterval(updateBusPositions, 30000);

}

function refreshMapOnDisplay(){
    google.maps.event.trigger(googlemap, "resize");
}

/**
* calls the vehicle location api and returns a lat long for a single bus
* moves marker to location of new lat lon of bus
*/
function updateBusPositions() {
    if (selected_route_id == null) {
        return;
    }

    $.ajax({
        type: "GET",
        headers: api_header,
        url: api_url + 'public/realtime',
        dataType: 'json',
        success: function (data) {
            var vehicles = [];
            var entities = data.response.entity;
            entities.forEach(function (e) {
                if (e.vehicle && e.vehicle.trip && e.vehicle.trip.route_id == selected_route_id) {
                    vehicles.push({ 'vehicle_id': e.vehicle.vehicle.id, 'latitude': e.vehicle.position.latitude, 'longitude': e.vehicle.position.longitude });
                }
            });
            if (vehicles.length > 0) {
                showVehicles(vehicles);
            }
            else {
                alert('No active buses on this route');
            }
        }
    });
}


/**
 * adds markers for each vehickle to the map
 * @param vehicles an array of vehicles to be displayed
 */
function showVehicles(vehicles) {
    var bounds = new google.maps.LatLngBounds();

    //gets rid of all existing markers
    //when bus moves, old markers deleted, new markers made in new position
    markers.forEach(function (m) {
        m.setMap(null);
    });

    vehicles.forEach(function (v) {
        var busMarker = new google.maps.Marker({
            position: { lat: v.latitude, lng: v.longitude },
            title: 'Bus: ' + v.vehicle_id,
            map: googlemap

        });

        var busInfoString = 'Bus Number: ' + v.vehicle_id;

        var infoWindow = new google.maps.InfoWindow({
            content: busInfoString
        });

        busMarker.addListener('click', function () {
            infoWindow.open(googlemap, busMarker)
        });


        markers.push(busMarker);
        //the map will zoom out to fit more markers if they were added to the bounds
        bounds.extend(busMarker.position);
    });

    googlemap.fitBounds(bounds);

}

