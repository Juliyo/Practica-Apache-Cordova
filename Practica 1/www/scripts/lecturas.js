var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var active = null;
var lecturas = [];
var tipo = document.cookie;       //Variable que indica si usamos base de datos local o api
//rellenarAPILecturas();
function rellenarAPILecturas() {
    relleno({ "identificadorIndividuo": 1, "identificadorLector": 1, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.385063, "longitud": -0.511147 });
    relleno({ "identificadorIndividuo": 2, "identificadorLector": 1, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.384294, "longitud": -0.511263 });
    relleno({ "identificadorIndividuo": 3, "identificadorLector": 1, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.384010, "longitud": -0.510635 });
    relleno({ "identificadorIndividuo": 4, "identificadorLector": 1, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.384592, "longitud": -0.509825 });
    relleno({ "identificadorIndividuo": 5, "identificadorLector": 2, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.387647, "longitud": -0.518554 });
    relleno({ "identificadorIndividuo": 6, "identificadorLector": 2, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.387821, "longitud": -0.517540 });
    relleno({ "identificadorIndividuo": 7, "identificadorLector": 2, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.387435, "longitud": -0.518074 });
    relleno({ "identificadorIndividuo": 8, "identificadorLector": 3, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.389016, "longitud": -0.515507 });
    relleno({ "identificadorIndividuo": 9, "identificadorLector": 3, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.388785, "longitud": -0.514370 });
    relleno({ "identificadorIndividuo": 10, "identificadorLector": 3, "fechaHora": $.format.date(new Date(), 'dd/mm/yy H:mm:ss'), "latitud": 38.388192, "longitud": -0.516151 });
    function relleno(datos) {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/lecturas/",
            data: datos,
            success: function (response) {
            }
        });
    }
}
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
        html = html + '</td><td>' + lecturas[i].fechaHora;
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
            var html = '<td><input type="checkbox" checked></td><th scope="row"><input class="form-control" disabled type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].identificadorIndividuo + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].identificadorLector + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
            html = html + lecturas[fila].fechaHora + '"></th><td><input class="form-control" type="text" style="font-size:0.8em;" value="';
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
                $(".form-control").each(function (col, obj) {
                    
                        datos[col] = $(this).val();
                    
                    
                });
                
                modificar(lecturas[fila].identificadorIndividuo, datos);
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
    var contador = 0;
    var contador2 = 0;
    $("input[type=checkbox]").each(function (fila, obj) {
        if ($(this).is(":checked")) {
            contador++;
        }
    });
    $("input[type=checkbox]").each(function (fila, obj) {
        if ($(this).is(":checked")) {
            contador2++;
            eliminar(lecturas[fila].identificadorIndividuo,contador,contador2);
        }
    });
    
    

});

function cargarLecturas() {
    if (tipo.localeCompare("db") == 0) {
        lecturasIndexedDB();
    } else {
        lecturasApi();
    }
}
function lecturasApi() {
    lecturas = [];
    $.getJSON("http://localhost:3000/lecturas", function (data) {
        for (var key in data) {
            lecturas.push(data[key]);
            //alert(JSON.stringify(elements[key]));
        }
        generateHtml();
    });
    
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

    if (tipo.localeCompare("db") == 0) {
        $(".crud2").css({ "display": "none" });
        $(".crud").css({ "display": "" });
        modificarIndexedDB(id, datos);
        
    } else {
        $(".crud2").css({ "display": "none" });
        $(".crud").css({ "display": "" });
        modificarApi(id, datos);
        
    }
}
function modificarApi(id, datos) {
    var data = {
        identificadorIndividuo: datos[0],
        identificadorLector: datos[1],
        fechaHora: datos[2],
        latitud: datos[3],
        longitud: datos[4]
    };
    $.ajax({
        type: "PUT",
        url: "http://localhost:3000/lecturas/"+id,
        data: data,
        success: function (response) {
            cargarLecturas();
        }
    });
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
        data.identificadorIndividuo = datos[0];
        data.identificadorLector = datos[1];
        data.fechaHora = datos[2];
        data.latitud = datos[3];
        data.longitud = datos[4];
        var request = object.put(data);

        request.onsuccess = function (e) {
            console.log("put success!");
            cargarLecturas();
        };

        request.onerror = function (e) {
            console.log("put error!");
        };
    };
}
function eliminar(key,contador,contador2) {
    if (tipo.localeCompare("db") == 0) {
        eliminarIndexedDB(key,contador,contador2);
    } else {
        eliminarApi(key,contador,contador2);
    }
}
function eliminarApi(key,contador,contador2) {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/lecturas/" + key,
        success: function (response) {
            if (contador == contador2) {
                cargarLecturas();
            }
            
        }
    });
}
function eliminarIndexedDB(key,contador,contador2) {
    active = dataBase.result;
    var data = active.transaction(["Lecturas"], "readwrite");
    var store = data.objectStore("Lecturas");

    var request = store.delete(key);
    //var request = store.clear(); // delete all from the store

    request.onsuccess = function (e) {
        // calls even when nothing to remove.
        console.log("removeByKey success!");
        if (contador == contador2) {
            cargarLecturas();
        }
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
    if (tipo.localeCompare("db") == 0) {
        add({ identificadorIndividuo: id, identificadorLector: ide, fechaHora: fecha, latitud: lat, longitud: lon }, "Lecturas");
        $('#clickVer').tab('show');
        $("#footer").css({ "display": "" });
        $(".crud2").css({ "display": "none" });
        $(".crud").css({ "display": "" });
        cargarLecturas();
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/lecturas/",
            data: { identificadorIndividuo: id, identificadorLector: ide, fechaHora: fecha, latitud: lat, longitud: lon },
            success: function (response) {
                $('#clickVer').tab('show');
                $("#footer").css({ "display": "" });
                $(".crud2").css({ "display": "none" });
                $(".crud").css({ "display": "" });
                cargarLecturas();
            }
        });
    }
    
    
}