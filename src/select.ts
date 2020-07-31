enum eAnimales{
    Todo,
    Perro,
    Gato
}

export class SelectAnimales {

    public selectAnimales:HTMLElement;
    private static cInstancias:number = 0;

    private constructor(id:string) {
        this.selectAnimales = document.getElementById(id);
    }

    public static crearInstancia(id:string):SelectAnimales {
        if (SelectAnimales.cInstancias == 1) {
            console.log("No se puede crear más de una instancia de SelectAnimales");
            return null;
        } else {
            SelectAnimales.cInstancias = 1;
            return new SelectAnimales(id);
        }
    }

    public cargarSelect():void {
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