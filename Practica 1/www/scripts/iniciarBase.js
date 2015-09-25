
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
function startDB() {
            
    dataBase = indexedDB.open("monitor", 3);
                
    dataBase.onupgradeneeded = function (e) {
        active = dataBase.result;
        active.deleteObjectStore("EstacionesLectoras");
        active.deleteObjectStore("Lecturas");
        object1 = active.createObjectStore("EstacionesLectoras", { keyPath : 'identificadorLector', autoIncrement : false });
        object1.createIndex('by_longitud', 'longitud', { unique : false });
        object1.createIndex('by_latitud', 'latitud', { unique: false });

        object2 = active.createObjectStore("Lecturas", { keyPath: 'identificadorIndividuo', autoIncrement: false });
        object2.createIndex('by_identificadorLector', 'identificadorLector', { unique: false });
        object2.createIndex('by_fechaHora', 'fechaHora', { unique: false });
        object2.createIndex('by_longitud', 'longitud', { unique: false });
        object2.createIndex('by_latitud', 'latitud', { unique: false });

    };

    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
        rellenar();
    };
        
    dataBase.onerror = function (e)  {
        alert('Error cargando la base de datos');
    };
}
function add(o, tabla) {
    var active = dataBase.result;
    var data = active.transaction(["EstacionesLectoras", "Lecturas"], "readwrite");
    var request = null;
    var estacion = null;
    if (tabla.localeCompare("EstacionesLectoras")==0) {
        estacion = data.objectStore("EstacionesLectoras");
        request = estacion.put(o);
    }else if(tabla.localeCompare("Lecturas")==0){
        estacion = data.objectStore("Lecturas");
        request = estacion.put(o);
    }

    data.oncomplete = function (e) {
        alert('Objeto agregado correctamente ' + tabla);
    };


}
function rellenar() {
    
    //EstacionesLectoras
    add({ identificadorLector: "1", longitud: "38.384467", latitud: "-0.510654" }, "EstacionesLectoras");
    add({ identificadorLector: "2", longitud: "38.387372", latitud: "-0.517551" }, "EstacionesLectoras");
    add({ identificadorLector: "3", longitud: "38.387435", latitud: "-0.518074" }, "EstacionesLectoras");
    //Lecturas
    add({ identificadorIndividuo: "1", identificadorLector: "1", fechaHora: new Date(), longitud: "38.385063", latitud: "-0.511147" }, "Lecturas");
    add({ identificadorIndividuo: "2", identificadorLector: "1", fechaHora: new Date(), longitud: "38.384294", latitud: "-0.511263" }, "Lecturas");
    add({ identificadorIndividuo: "3", identificadorLector: "1", fechaHora: new Date(), longitud: "38.384010", latitud: "-0.510635" }, "Lecturas");
    add({ identificadorIndividuo: "4", identificadorLector: "1", fechaHora: new Date(), longitud: "38.384592", latitud: "-0.509825" }, "Lecturas");
    add({ identificadorIndividuo: "5", identificadorLector: "2", fechaHora: new Date(), longitud: "38.387647", latitud: "-0.518554" }, "Lecturas");
    add({ identificadorIndividuo: "6", identificadorLector: "2", fechaHora: new Date(), longitud: "38.387821", latitud: "-0.517540" }, "Lecturas");
    add({ identificadorIndividuo: "7", identificadorLector: "2", fechaHora: new Date(), longitud: "38.387435", latitud: "-0.518074" }, "Lecturas");
    add({ identificadorIndividuo: "8", identificadorLector: "3", fechaHora: new Date(), longitud: "38.389016", latitud: "-0.515507" }, "Lecturas");
    add({ identificadorIndividuo: "9", identificadorLector: "3", fechaHora: new Date(), longitud: "38.388785", latitud: "-0.514370" }, "Lecturas");
    add({ identificadorIndividuo: "10", identificadorLector: "3", fechaHora: new Date(), longitud: "38.388192", latitud: "-0.516151" }, "Lecturas");

}
            