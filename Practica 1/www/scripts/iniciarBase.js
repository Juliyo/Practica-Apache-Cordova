
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var relleno = false;
/*Cuando se inicia la aplicación siempre se llamará a este método porque asi siempre rellenaremos
la base de datos, aunque luego se use apirest*/
function startDB() {
    /*var req = indexedDB.deleteDatabase("monitor");
    req.onsuccess = function () {
        console.log("Deleted database successfully");
    };
    req.onerror = function () {
        console.log("Couldn't delete database");
    };
    req.onblocked = function () {
        console.log("Couldn't delete database due to the operation being blocked");
    };*/
    dataBase = indexedDB.open("monitor", 1);
    
    dataBase.onupgradeneeded = function (e) {
        relleno = true;
        active = dataBase.result;
        //active.deleteObjectStore("EstacionesLectoras");
        //active.deleteObjectStore("Lecturas");
        var object1 = active.createObjectStore("EstacionesLectoras", { keyPath : 'identificadorLector', autoIncrement : false });
        object1.createIndex('by_longitud', 'longitud', { unique : false });
        object1.createIndex('by_latitud', 'latitud', { unique: false });

        var object2 = active.createObjectStore("Lecturas", { keyPath: 'identificadorIndividuo', autoIncrement: false });
        object2.createIndex('by_identificadorLector', 'identificadorLector', { unique: false });
        object2.createIndex('by_fechaHora', 'fechaHora', { unique: false });
        object2.createIndex('by_longitud', 'longitud', { unique: false });
        object2.createIndex('by_latitud', 'latitud', { unique: false });

    };

    dataBase.onsuccess = function (e) {
        console.log('Base de datos cargada correctamente');
        active = dataBase.result;
        if (relleno == true) {
            rellenar();
        }
        relleno = false;
    };
        
    dataBase.onerror = function (e)  {
        console.log('Error cargando la base de datos');
    };
}

/*Añade a la base de datos el objeto pasado como parámetro a la tabla especificada en 
el parámetro tabla*/
function add(o, tabla) {
    
    var data = active.transaction(["EstacionesLectoras", "Lecturas"], "readwrite");
    var request = null;
    var estacion = null;
    if (tabla.localeCompare("EstacionesLectoras")==0) {
        estacion = data.objectStore("EstacionesLectoras");
        request = estacion.add(o);
        request.onsuccess = function (e) {
            console.log("Add 'person' successful! person=" + JSON.stringify(o));
        };

        request.onerror = function (e) {
            console.log("Add error", e.target.error.name);
            console.log("Estación repetida!!!!");
        };
    }else if(tabla.localeCompare("Lecturas")==0){
        estacion = data.objectStore("Lecturas");
        request = estacion.add(o);
        request.onsuccess = function (e) {
            console.log("Add 'person' successful! person=" + JSON.stringify(o));
        };

        request.onerror = function (e) {
            console.log("Add error", e.target.error.name);
            console.log("Lectura repetida!!!!");
        };
    }

    data.oncomplete = function (e) {
        //alert('Objeto agregado correctamente ' + tabla);
    };


}
/*Rellena la base de datos inicialmente con unos valores por defecto, a este método solo se le
llama cuando se crea la base de datos*/
function rellenar() {
    //EstacionesLectoras
    add({ identificadorLector: "1", latitud: "38.384467", longitud: "-0.510654" }, "EstacionesLectoras");
    add({ identificadorLector: "2", latitud: "38.387372", longitud: "-0.517551" }, "EstacionesLectoras");
    add({ identificadorLector: "3", latitud: "38.389278", longitud: "-0.515136" }, "EstacionesLectoras");

    //Lecturas
    add({ identificadorIndividuo: "1", identificadorLector: "1", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.385063", longitud: "-0.511147" }, "Lecturas");
    add({ identificadorIndividuo: "2", identificadorLector: "1", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.384294", longitud: "-0.511263" }, "Lecturas");
    add({ identificadorIndividuo: "3", identificadorLector: "1", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.384010", longitud: "-0.510635" }, "Lecturas");
    add({ identificadorIndividuo: "4", identificadorLector: "1", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.384592", longitud: "-0.509825" }, "Lecturas");
    add({ identificadorIndividuo: "5", identificadorLector: "2", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.387647", longitud: "-0.518554" }, "Lecturas");
    add({ identificadorIndividuo: "6", identificadorLector: "2", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.387821", longitud: "-0.517540" }, "Lecturas");
    add({ identificadorIndividuo: "7", identificadorLector: "2", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.387435", longitud: "-0.518074" }, "Lecturas");
    add({ identificadorIndividuo: "8", identificadorLector: "3", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.389016", longitud: "-0.515507" }, "Lecturas");
    add({ identificadorIndividuo: "9", identificadorLector: "3", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.388785", longitud: "-0.514370" }, "Lecturas");
    add({ identificadorIndividuo: "10", identificadorLector: "3", fechaHora: $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), latitud: "38.388192", longitud: "-0.516151" }, "Lecturas");


}
            