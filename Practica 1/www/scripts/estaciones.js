var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var estaciones = [];

function startBD() {
    dataBase = indexedDB.open("monitor", "1");
    dataBase.onupgradeneeded = function (e) {
        active = dataBase.result;
    };
    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
        cargarEstaciones();
    };
}
function cargarEstaciones() {
    estaciones = [];
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
            estaciones.push(elements[key]);

        }

        elements = [];
        
        generateHtml();
    };
    

}
function generateHtml() {

    var html = '';

    $('#tablaEstaciones tbody tr').remove();

    for (var i = 0; i < estaciones.length; i++) {

        html = html + '<tr><td><input type="checkbox" ></td><th scope="row">' + estaciones[i].identificadorLector + '</th><td>' + estaciones[i].latitud + '</td><td>' + estaciones[i].longitud + '</td></tr>';

    }
    $('#tablaEstaciones tbody').append(html);

    var offset = 0;
    $("#tablaEstaciones tbody tr").each(function (fila, obj) {
        // $(obj).addClass("load");
        offset++;
        setTimeout(function () {
            fade(obj);
        }, 150 * offset, obj);
    });


}
function fade(objeto) {
    $(objeto).addClass("load");
}
document.getElementsByClassName('btn-success').onclick = function (e) {

    $('input[type=checkbox]').each(function (fila, obj) {
        if($(this).is(":cheked"))
    });
};