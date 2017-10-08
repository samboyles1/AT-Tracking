var googlemap = null;

var selected_route_id = null;
var lastOpenedInfoWindow = null;
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
            var allRoutes = [];
            entities.forEach(function (e) {
                //make a list of all unique route (For drop down)
                if (e.vehicle && e.vehicle.trip && !inRoutes(allRoutes, e.vehicle.trip.route_id)) {
                    var routeName = getRouteName(e.vehicle.trip.route_id); 
                    allRoutes.push((new Option(routeName, e.vehicle.trip.route_id)));
                }
            });

            //sort by name
            allRoutes.sort(sortRoute);

            //add all the routes to the drop down
            for(var i = 0 ; i < allRoutes.length ; i++){
                $('#routeSelector').append(allRoutes[i]);
            }

            $(".select-style").slideToggle();
            $(".spinner").fadeOut(100);
        }
    });
}

//returns true if the route_id is already in the list
function inRoutes(allRoutes, route_id) {
    for (var i = 0 ; i < allRoutes.length ; i++) {
        if (allRoutes[i].value == route_id) {
            return true;
        }
    }
    return false;
}

//sorting the routes by name
function sortRoute(a, b){
    if(a.text < b.text){
        return -1
    }

    if(a.text > b.text){
        return 1
    }
    return 0;
}

//find the name of the route for this route_id from the list we got from the database at start up
function getRouteName(route_id) {
    var route = dbRoutes.find(function (r) {
        return r.id == route_id;
    });
    return route ? route.route_name : (route_id + ' not found');
}

//css for the loading icons
function transitionElements(){
    $(".select-style").animate({top: "12%"}, 350);
    $(".spinner").css({top: "12.5%"});
    $(".spinner").css({left: "67%"});
    $("#mapdiv").fadeIn(1000);
    $("#selectorTitle").fadeOut(200);
}


//causes the map to refresh with new bus positions every 30secs
function setSelectedRoute(value) {
    selected_route_id = value;
    updateBusPositions();
    transitionElements();
    refreshMapOnDisplay();
    setInterval(updateBusPositions, 30000);

}

//refresh map size when window is changed
function refreshMapOnDisplay(){
    google.maps.event.trigger(googlemap, "resize");
}


//calls the realtime api and builds a list of buses (with their lat long) for the selected_route_id
//one big api call to get all routes then filters down to just the selected route
function updateBusPositions() {
    if (selected_route_id == null) {
        return;
    }
    $(".spinner").fadeIn(200);
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
            $(".spinner").fadeOut(200);
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
 * adds markers for each vehichle to the map
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

        var icon = {
            url: "models/bus_pointer.svg",
            scaledSize: new google.maps.Size(35, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };


        var busMarker = new google.maps.Marker({
            position: { lat: v.latitude, lng: v.longitude },
            title: 'Bus: ' + v.vehicle_id,
            map: googlemap,
            icon: icon

        });

        var busInfoString = 'Bus Number: ' + v.vehicle_id ;
        busInfoString += '<br>Route: ' + getRouteName(selected_route_id);
        busInfoString += '<br>Latitude: ' + v.latitude;
        busInfoString += '<br>Longitude: ' + v.longitude;

        var infoWindow = new google.maps.InfoWindow({
            content: busInfoString
        });

        busMarker.addListener('click', function () {
            closeLastOpenWindow();
            infoWindow.open(googlemap, busMarker)
            lastOpenedInfoWindow = infoWindow;
        });

        google.maps.event.addListener(infoWindow, 'closeclick', function() {
            googlemap.panTo(this.getPosition());
            googlemap.fitBounds(bounds);
        });

        google.maps.event.addListener(googlemap, "click", function(event) {
            infoWindow.close();
            //same again
            googlemap.panTo(busMarker.getPosition());
            googlemap.fitBounds(bounds);
        });

        function closeLastOpenWindow() {
            if (lastOpenedInfoWindow) {
                lastOpenedInfoWindow.close();
            }
        }
        markers.push(busMarker);
        //the map will zoom out to fit more markers if they were added to the bounds
        bounds.extend(busMarker.position);
    });

    googlemap.fitBounds(bounds);

}

