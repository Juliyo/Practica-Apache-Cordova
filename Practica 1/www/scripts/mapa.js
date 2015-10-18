
var markers = [];               //Array para guardar en el todos los 
var infoEstaciones = [];        //markers de estaciones y su infowindow
var markersLecturas = [];       //Array para guardar en el todos los markers de estaciones y su infowindow

var imageLect = "images/key.png";
var map = null;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var tipo = document.cookie;       //Variable que indica si usamos base de datos local o api
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
    if (tipo.localeCompare("db") == 0) {
        startBD();
    } else {
        cargarEstaciones();
    }
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
/*Iniciamos la base de datos y cargamos las estaciones*/
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
/*Este metodo se encarga de hacer una llamada para cargar en local
o en la api rest*/
function cargarEstaciones(){
    if (tipo.localeCompare("db") == 0) {
        estacionesIndexedDB();
    } else {
        estacionesApi();
    }
}

/*En este metodo realizaremos una llamada GET a la api rest que nos delvolverá todas las estaciones de la bbdd,
llamaremos a markersEstaciones y le pasaremos el objeto obtenido*/
function estacionesApi() {
    $.getJSON("http://localhost:3000/estaciones", function (data) {
        markersEstaciones(data);
    });
    
}
/*Este metodo se encarga de leer la base de datos local y al terminar llamar a markersEstaciones 
pasandole un array de estaciones*/
function estacionesIndexedDB(){
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

        markersEstaciones(elements);
        elements = [];

    };
}
/*Este metodo se encarga de mostrar en el mapa las estaciones recibidas por parámetro, además de añadir un 
listener on click para cada estación.*/
function markersEstaciones(elements) {
    for (var key in elements) {
        var longitud = new google.maps.LatLng(parseFloat(elements[key].latitud), parseFloat(elements[key].longitud));
        addMarker(longitud);
        var infowindow = new google.maps.InfoWindow({
            content: "Identificador de la estación: " + elements[key].identificadorLector
        });
        infoEstaciones.push(infowindow);
        var id = parseInt(elements[key].identificadorLector);
        //Creamos un listener para la marca y le pasamos el id de esa marca
        google.maps.event.addListener(markers[key], 'click', function (innerkey) {
            return function () {
                infoEstaciones[innerkey - 1].open(map, markers[innerkey - 1]);
                setTimeout(function () { infoEstaciones[innerkey-1].close(); }, '1000');
                cargarLecturas(innerkey);       /*Llamamos a cargarLecturas para que muestre en el mapa las lecturas de las estacion con id innerkey*/
                map.setZoom(16);
                map.setCenter(markers[innerkey - 1].getPosition());
            }
        }(id));
    }
    setMapOnAll(map);
}
/*Este metodo se encarga de hacer una llamada para cargar en local
o en la api rest*/
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
    if (tipo.localeCompare("db") == 0) {
        lecturasIndexedDB(id);
    } else {
        lecturasApi(id);
    }
    
}
function lecturasApi(id) {
    $.getJSON("http://localhost:3000/lecturas/"+id, function (data) {
        addMarkersLecturas(data);
    });
}
/*Este metodo se encarga de leer la base de datos local y al terminar llamar a addMarkersLecturas 
pasandole un array de lecturas*/
function lecturasIndexedDB(id) {
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
        if (parseInt(result.value.identificadorLector) == id) {
            elements.push(result.value);
        }

        result.continue();

    };
    data.oncomplete = function () {
        addMarkersLecturas(elements);

        elements = [];


    };
}
/*Este metodo se encarga de mostrar en el mapa las lecturas recibidas por parámetro*/
function addMarkersLecturas(elements) {
    for (var key in elements) {
        var longitud = new google.maps.LatLng(parseFloat(elements[key].latitud), parseFloat(elements[key].longitud));
        var marker = new google.maps.Marker({
            position: longitud,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: imageLect
        });

        markersLecturas.push(marker);
    }
    //Añadimos las marcas al mapa
    for (var i = 0; i < markersLecturas.length; i++) {

        markersLecturas[i].setMap(map);

    }
}
    
