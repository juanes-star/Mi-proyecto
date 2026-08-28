export class entidadComidas {

    idMeal: string = "";
    strMeal: string = "";
    strMealThumb: string = "";
    strCategory: string = "";
    ingredientes: string[] = [];
    precio: number = 0;

    
    static desdeApi(raw: any, precio: number = 0): entidadComidas {
        const comida = new entidadComidas();
        comida.idMeal = raw.idMeal;
        comida.strMeal = raw.strMeal;
        comida.strMealThumb = raw.strMealThumb;
        comida.strCategory = raw.strCategory ?? '';
        comida.precio = precio;
        comida.ingredientes = entidadComidas.extraerIngredientes(raw);
        return comida;
    }

    
    static extraerIngredientes(raw: any): string[] {
        const lista: string[] = [];
        for (let n = 1; n <= 20; n++) {
            const nombre = raw[`strIngredient${n}`];
            if (nombre && nombre.trim() !== '') {
                lista.push(nombre);
            }
        }
        return lista;
    }
}
