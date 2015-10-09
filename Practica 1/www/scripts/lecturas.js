var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var lecturas = [];
var tipo = "indexed";

//Iniciamos la base de datos y llamamos a cargar lecturas
function startBD() {
    dataBase = indexedDB.open("monitor", "1");
    dataBase.onupgradeneeded = function (e) {
        active = dataBase.result;
    };
    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
        cargarLecturas();
    };
}
/*Este método se encarga de generar el html de la tabla del CRUD con las lecturas almacenadas
en el array lecturas*/
function generateHtml() {

    var html = '';
    //Vaciamos la tabla
    $('#tablaLecturas tbody').empty();
    //LLenamos la tabla
    for (var i = 0; i < lecturas.length; i++) {

        html = html + '<tr><td><input type="checkbox" ></td><th scope="row">' + lecturas[i].identificadorIndividuo;
        html = html + '</th><td>' + lecturas[i].identificadorLector;
        html = html + '</td><td>' + $.format.date(lecturas[i].fechaHora, 'dd/mm/yy H:mm:ss');
        html = html + '</td><td>' + lecturas[i].latitud + '</td><td>';
        html = html + lecturas[i].longitud + '</td></tr>';

    }
    $("#tablaLecturas tbody").append(html);

    var offset = 0;
    $("#tablaLecturas tbody tr").each(function (fila, obj) {
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
$("#clickAdd").click(function (e) {
    $("#footer").css({ "display": "none" });

});
$("#clickVer").click(function (e) {
    $("#footer").css({ "display": "" });
    $(".crud2").css({ "display": "none" });
    $(".crud").css({ "display": "" });
    cargarLecturas();
});
/*Este método se ejecuta cuando el usuario hace click en el botón modificar, lo que hace es
recorrer la tabla con jquery y ver la primera fila que tenga el checkbox checked, cuando la encuentra
cambia el html de la tabla para que en esta fila aparezca un input text en cada columna con los datos
de la estación a modificar.*/
$("#modificar").click(function (e) {
    var encontrado = false;
    var f;
    //Vemos que fila esta marcada con check
    $("input[type=checkbox]").each(function (fila, obj) {
        if ($(this).is(":checked") && encontrado == false) {
            f = fila;
            encontrado = true;
        }
    });
    $("#tablaLecturas tbody tr").each(function (fila, obj) {
        if (fila == f) {
            var html = '<td><input type="checkbox" checked></td><th scope="row"><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].identificadorIndividuo + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].identificadorLector + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + $.format.date(lecturas[fila].fechaHora, 'dd/mm/yy H:mm:ss') + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].latitud + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].longitud + '"></td>';
            $(this).empty();
            $(this).append(html);
            $(".crud2").css({ "display": "" });
            $(".crud").css({ "display": "none" });

            /*Cuando el usuario hace click en aceptar, llama el método modificar, con el identificador de la
            estación y los datos a modificar*/
            $("#aceptar").click(function (e) {
                var datos = [];
                $(".form-control").each(function (fila, obj) {
                    datos[fila] = $(this).val();
                });
                modificar(lecturas[fila].identificadorLector, datos);
            });
            /*Si el usuario cancela la acción de modificar se vuelve a generar el html de la tabla*/
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
$("#eliminar").click(function (e) {
    //Vemos que fila esta marcada con check
    $("input[type=checkbox]").each(function (fila, obj) {
        if ($(this).is(":checked")) {
            eliminar(lecturas[fila].identificadorLector);
        }
    });
    cargarLecturas();

});

function cargarLecturas() {
    if (tipo.localeCompare("indexed") == 0) {
        lecturasIndexedDB();
    } else {

    }
}
//Cargamos las lecturas abriendo una transaccion con la base de datos y guardamos los resultados en elements
function lecturasIndexedDB() {
    lecturas = [];
    active = dataBase.result;
    var data = active.transaction(["Lecturas"], "readonly");
    var object = data.objectStore("Lecturas");
    var elements = [];

    object.openCursor().onsuccess = function (e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }
        //Guardamos los objetos lecturasLectoras en elements
        elements.push(result.value);
        result.continue();

    };
    //Cuando se complete la transaccion nos guardaremos las lecturas leidas en un array
    data.oncomplete = function () {

        for (var key in elements) {
            lecturas.push(elements[key]);
            //alert(JSON.stringify(elements[key]));
        }

        elements = [];
        //LLamamos a este metodo que cargara en el html los datos leidos
        generateHtml();
    };

}

function modificar(id, datos) {

    if (tipo.localeCompare("indexed") == 0) {
        $(".crud2").css({ "display": "none" });
        $(".crud").css({ "display": "" });
        modificarIndexedDB(id, datos);
        cargarLecturas();
    } else {

    }
}
function modificarIndexedDB(id, datos) {
    active = dataBase.result;
    var data = active.transaction(["Lecturas"], "readwrite");
    var object = data.objectStore("Lecturas");

    object.get(id).onsuccess = function (e) {
        console.log("store.get", id);
        var data = e.target.result;
        if (!data) {
            console.log("nothing matched.");
            return;
        }
        // modify 'name' to upperCase

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
}
function eliminar(key) {
    if (tipo.localeCompare("indexed") == 0) {
        eliminarIndexedDB(key);
    } else {

    }
}
function eliminarIndexedDB(key) {
    active = dataBase.result;
    var data = active.transaction(["Lecturas"], "readwrite");
    var store = data.objectStore("Lecturas");

    var request = store.delete(key);
    //var request = store.clear(); // delete all from the store

    request.onsuccess = function (e) {
        // calls even when nothing to remove.
        console.log("removeByKey success!");
    };

    request.onerror = function (e) {
        console.log("removeByKey error!");
    };
}
function addLectura() {
    var id = $("#id").val();
    var ide = $("#ide").val();
    var fecha = $("#fecha").val();
    var lat = $("#lat").val();
    var lon = $("#lon").val();
    add({ identificadorIndividuo: id,identificadorLector: ide,fechaHora: fecha, latitud: lat, longitud: lon }, "Lecturas");
    $('#clickVer').tab('show');
    cargarLecturas();
}