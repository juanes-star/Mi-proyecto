import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

@Injectable({
    providedIn: 'root'
})

export class ComidaApi {

    constructor(private servicioApi: HttpClient) { }


    listarCategorias(): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/list.php?c=list`);
    }


    comidasPorCategoria(categoria: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/filter.php?c=${encodeURIComponent(categoria)}`);
    }


    buscarPorNombre(nombre: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/search.php?s=${encodeURIComponent(nombre)}`);
    }


    buscarPorIngrediente(ingrediente: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingrediente)}`);
    }


    buscarPorId(idMeal: string): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/lookup.php?i=${encodeURIComponent(idMeal)}`);
    }


    buscarAleatorio(): Observable<any> {
        return this.servicioApi.get(`${BASE_URL}/random.php`);
    }
}
