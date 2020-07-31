import Mascota from "../ts transpilado/entidades.js";
import { SelectAnimales } from "../ts transpilado/select.js";
let arrayDeMascotas;
let mascotaSeleccionada;
let tablaHead = document.getElementById("tablaHead");
let tablaBody = document.getElementById("tablaBody");
let formulario = document.getElementById("formulario");
let btnGuardar = document.getElementById("btnGuardar");
let btnEliminar = document.getElementById("btnEliminar");
let btnCancelar = document.getElementById("btnCancelar");
let selectAnimales = document.getElementById("selectAnimales");
let arrayDeCheckboxes;
let checkboxes_booleans;
let divSpinner;
console.log("start");

//////////////////////////////////////////////////////////////// Tabla

function tabla_crear(array) {
    if (!array)
        return;

    tablaHead.innerHTML = "";
    tablaBody.innerHTML = "";
    let trHeader = document.createElement("tr");
    let tr_plantilla = document.createElement("tr");
    let c = 0;

    for (const key in array[0]) {
        let th = document.createElement("th");
        th.innerHTML = formatearTexto(key);
        th.style.display = "table-cell";
        th.classList.add("text-center");
        th.classList.add("align-middle");
        trHeader.appendChild(th);

        let td = document.createElement("td");
        td.style.display = "table-cell";
        tr_plantilla.appendChild(td);
    }
    trHeader.setAttribute("id", "tablaHeader");
    tablaHead.appendChild(trHeader);
    tabla_cuerpo(array, tr_plantilla);
    calcularDivGris(array);
    revisarCheckboxes();
}

function tabla_cuerpo(array, plantilla) {
    let fragmento = document.createDocumentFragment();
    let c;

    array.forEach(e => {
        c = 0;
        for (const key in e) {
            plantilla.children[c].innerHTML = e[key];
            c++;
        }
        let copia = document.importNode(plantilla, true);
        fragmento.appendChild(copia);
    });
    tablaBody.appendChild(fragmento);
    tabla_agregarListeners();
}

function tabla_agregarListeners() {
    var rows = tablaBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        var currentRow = tablaBody.rows[i];
        
        var handler = function(row) {
            return function() {
                let idSeleccionado = row.firstElementChild.innerHTML;
                mascotaSeleccionada = arrayDeMascotas.find(function(element) {
                    if (element.id == idSeleccionado)
                        return element;
                });
                formulario_mostrarSeleccion();
            };
        };
    
        currentRow.onclick = handler(currentRow);
    }
}

function formatearTexto(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    string = string.replace("_", " ");
    return string;
}

//////////////////////////////////////////////////////////////// Formulario

function formulario_mostrarSeleccion() {
    formulario.reset();

    document.getElementById("txtTitulo").value = mascotaSeleccionada.titulo;
    document.getElementById("txtDescripcion").value = mascotaSeleccionada.descripcion;
    if (mascotaSeleccionada.animal == "perro" || mascotaSeleccionada.animal == "Perro") {
        document.getElementById("rdPerro").checked = true
    } else {
        document.getElementById("rdGato").checked = true
    }
    document.getElementById("txtPrecio"). value = mascotaSeleccionada.precio;
    document.getElementById("txtRaza"). value = mascotaSeleccionada.raza;
    document.getElementById("txtNacimiento").value = mascotaSeleccionada.fecha_nacimiento;
    if (mascotaSeleccionada.vacuna == "si" || mascotaSeleccionada.vacuna == "Si") {
        seleccionarElemento("txtVacunas", "Si");
    } else {
        seleccionarElemento("txtVacunas", "No");
    }

    btnEliminar.hidden = false;
    btnCancelar.hidden = false;
}

function formulario_validarCampos() {
    let titulo = document.getElementById("txtTitulo").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let animalPerro = document.getElementById("rdPerro").checked;
    let animalGato = document.getElementById("rdGato").checked;
    let animal;
    let precio = parseInt(document.getElementById("txtPrecio").value);
    let raza = document.getElementById("txtRaza").value;
    let nacimiento = document.getElementById("txtNacimiento").value;
    let vacuna = document.getElementById("txtVacunas").value;

    if (titulo.length === 0) {                    // Título
        alert("Título inválido")
        return false;
    } else {
        titulo = formulario_mayuscula(titulo);
    }

    if (descripcion.length === 0) {             // Descripcion
        alert("Descripción inválida");
        return false;
    } else {
        descripcion = formulario_mayuscula(descripcion);
    }

    if (animalPerro === true) {             // Transacción
        animal = "Perro";
    } else if (animalGato == true) {
        animal = "Gato";
    } else {
        alert("Falta seleccionar animal")
        return false;
    }

    if (isNaN(precio) || precio <= 0) {         // Precio
        alert("Precio inválido");
        return false;
    }

    if (raza.length === 0) {                    // Raza
        alert("Raza inválida")
        return false;
    } else {
        raza = formulario_mayuscula(raza);
    }

    if (nacimiento.length === 0) {                    // Raza
        alert("Fecha inválida")
        return false;
    }

    if (vacuna != "Si" && vacuna != "No") {
        alert("Falta vacunas");
        return false;
    }

    let mascota = new Mascota(null, titulo, "Venta", descripcion, precio, animal, raza, nacimiento, vacuna);

    return mascota;
}

function formulario_mayuscula(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function seleccionarElemento(id, valueToSelect) {    
    let e = document.getElementById(id);
    e.value = valueToSelect;
}

//////////////////////////////////////////////////////////////// Handlers

window.onload = ()=> {
    divSpinner = document.getElementById("divSpinner");
    let imgSpinner = document.createElement("img");
    imgSpinner.setAttribute("src", "./img/spinner.gif");
    imgSpinner.setAttribute("alt", "Que lindo mi spinner. Se rompió mi spinner :(");
    imgSpinner.setAttribute("id", "imgSpinner");

    let imgBlanco = document.createElement("img");
    imgBlanco.setAttribute("src", "./img/blanco.png");
    imgBlanco.setAttribute("alt", "Overlay blanco");
    imgBlanco.setAttribute("id", "imgBlanco");

    divSpinner.appendChild(imgBlanco);
    divSpinner.appendChild(imgSpinner);
    divSpinner.style.visibility = "hidden";

    cargarArrayDeCheckboxes();
    let sa = SelectAnimales.crearInstancia("selectAnimales");
    sa.cargarSelect();

    traer()
}

formulario.onsubmit = (e)=> {
    e.preventDefault();

    let mascota = formulario_validarCampos();
    if (mascota) {
        if (mascotaSeleccionada == null) {
            mascota.id = null;
            alta(mascota)
        } else {
            mascota.id = mascotaSeleccionada.id;
            modificar(mascota);
            mascotaSeleccionada = null;
            formulario.reset();
        }
    }
};

btnCancelar.onclick = ()=> {
    mascotaSeleccionada = null;
    formulario.reset();
    btnCancelar.hidden = true;
    btnEliminar.hidden = true;
}

btnEliminar.onclick = ()=> {
    if (mascotaSeleccionada != null) {
        baja(mascotaSeleccionada);
        mascotaSeleccionada = null;
        btnCancelar.hidden = true;
        btnEliminar.hidden = true;
    }
}

selectAnimales.onchange = ()=> {
    filtrarSegunAnimal();
    revisarCheckboxes();
}

////////////////////////////////////////////////////////////////  Segundo parcial

function cargarArrayDeCheckboxes() {
    arrayDeCheckboxes = [];
    let idDeCheckbox = "check";
    for (let f = 0; f < 8; f++) {
        idDeCheckbox += f;
        arrayDeCheckboxes[f] = document.getElementById(idDeCheckbox);
        arrayDeCheckboxes[f].onchange = ()=> {
            ocultarOMostrarColumna(f+1);
            checkboxes_booleans[f] = !checkboxes_booleans[f]
            localStorage.setItem("checkboxes", JSON.stringify(checkboxes_booleans));
        }
        idDeCheckbox = idDeCheckbox.replace(f, "");
    }

    if (localStorage.getItem("checkboxes")) {
        checkboxes_booleans = JSON.parse(localStorage.getItem("checkboxes"))
        for (let f = 0; f < 8; f++) {
            if (!checkboxes_booleans[f]) {
                arrayDeCheckboxes[f].checked = false;
            }                
        }
    } else {
        checkboxes_booleans = [true, true, true, true, true, true, true, true];
        localStorage.setItem("checkboxes", JSON.stringify(checkboxes_booleans));
    }
}

function filtrarSegunAnimal() {
    let animal = selectAnimales.value;
    if (animal == "Todo") {
        tabla_crear(arrayDeMascotas);
    } else {
        animal = animal.toLowerCase();
        let arrayFiltrado = arrayDeMascotas.filter(e=> e.animal.toLowerCase() == animal);
        tabla_crear(arrayFiltrado);
    }
}

function calcularDivGris(array) {
    let promedio = array.map(e => parseInt(e.precio))
        .reduce((acumulador, valor)=> acumulador + valor, 0)/array.length;
    if ((promedio - parseInt(promedio)) != 0)
        promedio = promedio.toFixed(2);
    document.getElementById("txtPromedioPrecios").value = promedio;

    let max = array.map(e => parseInt(e.precio))
        .reduce((previo, valor) => previo>valor ? previo : valor, array[0]);
    document.getElementById("txtPrecioMaximo").value = max;

    let min = array.map(e => parseInt(e.precio))
        .reduce((previo, valor) => previo<valor ? previo : valor, array[0]);
    document.getElementById("txtPrecioMinimo").value = min;

    let cVacunados = array.map(e => e.vacuna)
        .map(e => e.toLowerCase() =="si" ? true : false)
        .filter(e => e == true)
        .length;
    let porcentaje = (cVacunados * 100) / array.length;
    if ((porcentaje - parseInt(porcentaje)) != 0)
        porcentaje = porcentaje.toFixed(2);
    document.getElementById("txtPorcentajeVacunas").value = porcentaje + "%"
}

function revisarCheckboxes() {
    let trHeader = document.getElementById("tablaHeader");
    let ths = trHeader.children;
    if (ths) {
        let tds;

        for (let f=0; f< arrayDeCheckboxes.length; f++) {
            if (arrayDeCheckboxes[f].checked) {
                ths[f+1].style.display = "table-cell";
                for (let g=0; g<tablaBody.children.length; g++) {
                    tds = tablaBody.children[g].children;
                    tds[f+1].style.display = "table-cell";
                }
            } else {
                ths[f+1].style.display = "none";            
                for (let g=0; g<tablaBody.children.length; g++) {
                    tds = tablaBody.children[g].children;
                    tds[f+1].style.display = "none";
                }
            }
        }
    }
}

function ocultarOMostrarColumna(index) {
    let trHeader = document.getElementById("tablaHeader");
    if (trHeader) {
        let ths = trHeader.children;
        if (ths[index].style.display == "table-cell") {
            ths[index].style.display = "none";
        } else {
            ths[index].style.display = "table-cell";
        }
        let tds;
        for (let f=0; f<tablaBody.children.length; f++) {
            tds = tablaBody.children[f].children;
            if (tds[index].style.display == "table-cell") {
                tds[index].style.display = "none";
            } else {
                tds[index].style.display = "table-cell";
            }
        }
    }
}

////////////////////////////////////////////////////////////////  Local storage

function traer() {
    if (localStorage.getItem("mascotas")) {
        arrayDeMascotas = JSON.parse(localStorage.getItem("mascotas"));
        tabla_crear(arrayDeMascotas);
    } else {
        console.log("No hay LS de mascotas. Se creará una instancia vacía");
        arrayDeMascotas = [];
        localStorage.setItem("mascotas", JSON.stringify(arrayDeMascotas));
    }
}

function alta(mascota) {
    let maxId = 0;
    arrayDeMascotas.forEach(element => {
        if (element.id > maxId)
            maxId = element.id;
    });
    mascota.id = parseInt(maxId)+1;
    arrayDeMascotas.push(mascota);
    localStorage.setItem("mascotas", JSON.stringify(arrayDeMascotas));
    divSpinner.style.visibility = "visible";
    setTimeout(() => {
        divSpinner.style.visibility = "hidden";
        formulario.reset();
        tabla_crear(arrayDeMascotas)
    }, 1000);
}

function modificar(mascota) {
    for (let f = 0; f < arrayDeMascotas.length; f++) {
        // the virgin js funcional vs the CHAD for
        if (arrayDeMascotas[f].id == mascota.id)
            arrayDeMascotas[f] = mascota;
    }
    localStorage.setItem("mascotas", JSON.stringify(arrayDeMascotas));
    formulario.reset();
    tabla_crear(arrayDeMascotas);
}

function baja(mascota) {
    let index = arrayDeMascotas.indexOf(mascota);
    if (index > -1) {
        arrayDeMascotas.splice(index, 1);
    }
    localStorage.setItem("mascotas", JSON.stringify(arrayDeMascotas));
    formulario.reset();
    tabla_crear(arrayDeMascotas);
}

////////////////////////////////////////////////////////////////  Test

let btnTest = document.getElementById("btnTest");
btnTest.onclick = ()=> {
}