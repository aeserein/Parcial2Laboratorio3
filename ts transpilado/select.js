var eAnimales;
(function (eAnimales) {
    eAnimales[eAnimales["Todo"] = 0] = "Todo";
    eAnimales[eAnimales["Perro"] = 1] = "Perro";
    eAnimales[eAnimales["Gato"] = 2] = "Gato";
})(eAnimales || (eAnimales = {}));
export class SelectAnimales {
    constructor(id) {
        this.selectAnimales = document.getElementById(id);
    }
    static crearInstancia(id) {
        if (SelectAnimales.cInstancias == 1) {
            console.log("No se puede crear más de una instancia de SelectAnimales");
            return null;
        }
        else {
            SelectAnimales.cInstancias = 1;
            return new SelectAnimales(id);
        }
    }
    cargarSelect() {
        if (this.selectAnimales != null) {
            for (let item in eAnimales) {
                if (isNaN(Number(item))) {
                    let option = document.createElement("option");
                    option.setAttribute("value", item);
                    option.innerHTML = item + "s";
                    this.selectAnimales.appendChild(option);
                }
            }
        }
    }
}
SelectAnimales.cInstancias = 0;
//# sourceMappingURL=select.js.map