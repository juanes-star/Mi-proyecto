import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

@Injectable({
    providedIn: 'root'
})

export class BebidasApi {
 
    constructor(private servicioApi: HttpClient) { }


    listarCategorias(): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/list.php?c=list`);
    }


    bebidasPorCategoria(categoria: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/filter.php?c=${encodeURIComponent(categoria)}`);
    }


    buscarPorNombre(nombre: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/search.php?s=${encodeURIComponent(nombre)}`);
    }


    buscarPorIngrediente(ingrediente: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingrediente)}`);
    }


    filtrarPorAlcohol(tipo: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/filter.php?a=${encodeURIComponent(tipo)}`);
    }


    buscarPorId(idDrink: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/lookup.php?i=${encodeURIComponent(idDrink)}`);
    }


    buscarAleatorio(): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/random.php`);
    }

}
