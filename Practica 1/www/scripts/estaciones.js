var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var estaciones = [];
//Iniciamos la base de datos y llamamos a cargar estaciones
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
//Cargamos las estaciones abriendo una transaccion con la base de datos y guardamos los resultados en elements
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
    //Cuando se complete la transaccion nos guardaremos las estaciones leidas en un array
    data.oncomplete = function () {

        for (var key in elements) {
            estaciones.push(elements[key]);

        }

        elements = [];
        //LLamamos a este metodo que cargara en el html los datos leidos
        generateHtml();
    };
    

}
function generateHtml() {

    var html = '';
    //Vaciamos la tabla
    $('#tablaEstaciones tbody').empty();
    //LLenamos la tabla
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
$("#añadir").click(function (e) {
    $("#footer").css({ "display": "none" });
    
});
$("#ver").click(function (e) {
    $("#footer").css({ "display": "" });
    $(".crud2").css({ "display": "none" });
    $(".crud").css({ "display": "" });
    cargarEstaciones();
});
//Cuando el usuario pulse en el boton modificar
$("#modificar").click(function (e) {
    var encontrado = false;
    var f;
    //Vemos que fila esta marcada con check
    $("input[type=checkbox]").each(function (fila, obj) {
        if ($(this).is(":checked") && encontrado==false) {
            f=fila;
            encontrado = true;
        }
    });
    $("#tablaEstaciones tbody tr").each(function (fila, obj) {
        if (fila == f) {
            var html = '<td><input type="checkbox" checked></td><th scope="row"><input class="form-control" type="text" value="';
            html = html + estaciones[fila].identificadorLector + '"></th><td><input class="form-control" type="text" value="';
            html = html + estaciones[fila].latitud + '"></th><td><input class="form-control" type="text" value="';
            html = html + estaciones[fila].longitud + '"></td>';
            $(this).empty();
            $(this).append(html);
            $(".crud2").css({ "display": "" });
            $(".crud").css({ "display": "none" });
            
            
            $("#aceptar").click(function (e) {
                modificar(fila);
            });
            $("#cancelar").click(function (e) {
                $(".crud2").css({ "display": "none" });
                $(".crud").css({ "display": "" });
                generateHtml();
            });
            
            $("input[type=checkbox]").each(function () {
                    $(this).attr("disabled", true);
            });
            
        }
    });
});
function modificar(fila) {
   
    active = dataBase.result;
    var data = active.transaction(["EstacionesLectoras"], "readwrite");
    var object = data.objectStore("EstacionesLectoras");

    object.get(estaciones[fila].identificadorLector).onsuccess = function (e) {
        console.log("store.get", fila);
        var data = e.target.result;
        if (!data) {
            console.log("nothing matched.");
            return;
        }
        // modify 'name' to upperCase
        var datos = [];
        $(".form-control").each(function (fila, obj) {
            datos[fila] = $(this).val();
        });
        data.identificadorLector = datos[0];
        data.latitud = datos[1];
        data.longitud = datos[2];
        var request = object.put(data);

        request.onsuccess = function (e) {
            console.log("put success!");
        };

        request.onerror = function (e) {
            console.log("put error!");
        };
    };
    $(".crud2").css({ "display": "none" });
    $(".crud").css({ "display": "" });
    cargarEstaciones();
    
}