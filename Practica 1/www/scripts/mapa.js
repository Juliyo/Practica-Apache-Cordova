
var markers = [];
var map = null;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}


function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 80,
        center: { lat: 38.385528, lng: -0.513581 }
    });
    directionsDisplay.setMap(map);
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }
    document.getElementById('Inicio').addEventListener('change', onChangeHandler);
    document.getElementById('Fin').addEventListener('change', onChangeHandler);
    
    //Leemos la base de datos
    cargarMarkers();
    
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById("Inicio").value,
        destination: document.getElementById("Fin").value,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            //window.alert('Petición de direcciones fallida debido a: ' + status);
        }
    });
}
function cargarMarkers(){
    var dataBase = indexedDB.open("monitor", "1");
    alert("Llego");
    var active = dataBase.result;

    var data = active.transaction(["EstacionesLectoras"], "readonly");

    var object = data.objectStore("EstacionesLectoras");
    var elements = [];

    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }

        elements.push(result.value);
        result.continue();

    };
    data.oncomplete = function () {

        for (var key in elements) {

            var longitud = { lat: elements[key].latitud, lng: elements[key].longitud };
            addMarker(longitud);

        }
        showMarkers();
        elements = [];
    };
}