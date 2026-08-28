export class EntidadBebidas {

    idDrink: string = "";
    strDrink: string = "";
    strDrinkThumb: string = "";
    strCategory: string = "";
    strAlcoholic: string = "";
    ingredientes: string[] = [];
    precio: number = 0;

    
    static desdeApi(raw: any, precio: number = 0): EntidadBebidas {
        const bebida = new EntidadBebidas();
        bebida.idDrink = raw.idDrink;
        bebida.strDrink = raw.strDrink;
        bebida.strDrinkThumb = raw.strDrinkThumb;
        bebida.strCategory = raw.strCategory ?? '';
        bebida.strAlcoholic = raw.strAlcoholic ?? '';
        bebida.precio = precio;
        bebida.ingredientes = EntidadBebidas.extraerIngredientes(raw);
        return bebida;
    }

    
    static extraerIngredientes(raw: any): string[] {
        const lista: string[] = [];
        for (let n = 1; n <= 15; n++) {
            const nombre = raw[`strIngredient${n}`];
            if (nombre && nombre.trim() !== '') {
                lista.push(nombre);
            }
        }
        return lista;
    }
}
