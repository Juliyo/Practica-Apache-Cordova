
//Array para guardar en el todas las estaciones
var markers = [];
//Array para guardar de forma temparal las lecturas
var markersLecturas = [];
var imageLect = "images/key.png";
var map = null;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 38.385528, lng: -0.513581 }
    });
    directionsDisplay.setMap(map);
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }
    document.getElementById('Inicio').addEventListener('change', onChangeHandler);
    document.getElementById('Fin').addEventListener('change', onChangeHandler);
    //Cargamos la base de datos para situar las marcas en el mapa
    startBD();
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


// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
    //alert("Marca 1: " + markers[0].position);
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

function startBD(){
    dataBase = indexedDB.open("monitor", "1");
    dataBase.onupgradeneeded = function (e) {
        active = dataBase.result;
    };
    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
        cargarEstaciones();
    };
}
//Este metodo se encarga de leer la base de datos y mostrar las Estaciones en el mapa, además de añadir un 
//listener on click para cada marca.
function cargarEstaciones(){
    active = dataBase.result;
    var data = active.transaction(["EstacionesLectoras"], "readonly");
    var object = data.objectStore("EstacionesLectoras");
    var elements = [];

    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }
        //Guardamos los objetos EstacionesLectoras en elements
        elements.push(result.value);
        result.continue();

    };
    data.oncomplete = function () {

        for (var key in elements) {
            var longitud = new google.maps.LatLng(parseFloat(elements[key].latitud),parseFloat(elements[key].longitud));
            addMarker(longitud);
            var id = parseInt(elements[key].identificadorLector);
            //Creamos un listener para la marca y le pasamos el id de esa marca
            google.maps.event.addListener(markers[key], 'click', function (innerkey) {
                return function () {
                    cargarLecturas(innerkey);
                    map.setZoom(16);
                    map.setCenter(markers[innerkey-1].getPosition());
                }
            }(id));
        }
        /*for (var key in elements) {
            markers[key].addListener('click', cargarLecturas);
            
        }*/
        setMapOnAll(map);
        elements = [];

    };
}
//Este metodo se encarga de leer la bbdd y de cargar en el mapa las lecturas cuyo identificadorLector es id
function cargarLecturas(id) {
    //Cuando se llama a este metodo hay que limpiar primero el mapa de lecturas
    for (var i = 0; i < markersLecturas.length; i++) {

        markersLecturas[i].setMap(null);

    }
    //Vaciamos el array que utilizaremos para guardar las lecturas
    markersLecturas = [];
    //Primero vaciamos el mapa de marcas
    clearMarkers();
    //Añadimos las marcas de estaciones
    showMarkers();
    //Ahora añadimos las lecturas de la estacion con id pasado por parametro
    active = dataBase.result;
    var data = active.transaction(["Lecturas"], "readonly");
    var object = data.objectStore("Lecturas");
    var elements = [];
    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }
        //Guardamos los objetos en el array elements
        elements.push(result.value);
        result.continue();

    };
    data.oncomplete = function () {
        for (var key in elements) {
            if(parseInt(elements[key].identificadorLector)==id){
                var longitud = new google.maps.LatLng(parseFloat(elements[key].latitud), parseFloat(elements[key].longitud));
                var marker = new google.maps.Marker({
                    position: longitud,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: imageLect
                });

                markersLecturas.push(marker);
                
            }
            
        }
        //Añadimos las marcas al mapa
        for (var i = 0; i < markersLecturas.length; i++) {
        
            markersLecturas[i].setMap(map);
        
        }
        elements = [];


    };
}
    
