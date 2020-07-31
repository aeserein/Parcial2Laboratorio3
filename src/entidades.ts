export default class Mascota {
    public id:number;
    public titulo:string;
    public transaccion:string;
    public descripcion:string;
    public precio:number;
    public animal:string;
    public raza:string;
    public fecha_nacimiento:string;
    public vacuna:string;

    constructor(id:number, titulo:string, transaccion:string, descripcion:string, precio:number,
                animal:string, raza:string, fecha_nacimiento:string, vacuna:string) {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;
        this.precio = precio;
        this.animal = animal;
        this.raza = raza;
        this.fecha_nacimiento = fecha_nacimiento;
        this.vacuna = vacuna;
    }
}