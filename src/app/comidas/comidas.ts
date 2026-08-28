import { Component, OnInit, signal } from '@angular/core';
import { ComidaApi } from '../servicios/comida-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carrito } from '../servicios/carrito';
import { entidadComidas } from '../entidades/entidad-comidas';

@Component({
  selector: 'app-comidas',
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.html',
  styleUrl: './comidas.css',
})
export class Comidas implements OnInit {

  categoriasApi = signal<any[]>([]);
  verApi = signal<entidadComidas[]>([]);

  detalleCache = signal<Record<string, entidadComidas>>({});
  precios = signal<Record<string, number>>({});

  nombreBusqueda = '';
  ingredienteBusqueda = '';

  modoBusqueda = signal(false);
  resultadosBusqueda = signal<entidadComidas[]>([]);
  buscando = signal(false);
  sinResultados = signal(false);

  constructor(private serviciosApi: ComidaApi, private carrito: Carrito) { }

  ngOnInit(): void {
    this.comidasCategoria();
  }

  comidasCategoria() {
    this.serviciosApi.listarCategorias().subscribe(categorias => {
      this.categoriasApi.set(categorias.meals);
      this.ver();
    });
  }

  ver() {
    for (let i = 0; i < this.categoriasApi().length; i++) {
      const categoria: string = this.categoriasApi()[i].strCategory;

      this.serviciosApi.comidasPorCategoria(categoria).subscribe(dato => {
        const mealsConCategoria = (dato.meals ?? []).map((m: any) => ({
          ...m,
          strCategory: categoria
        }));

        this.asignarPrecios(mealsConCategoria);

        const entidades = mealsConCategoria.map((m: any) =>
          entidadComidas.desdeApi(m, this.precioDe(m.idMeal))
        );

        this.verApi.update(actual => [...actual, ...entidades]);
      });
    }
  }

  mealsPorCategoria(categoria: string): entidadComidas[] {
    return this.verApi()
      .filter(m => m.strCategory === categoria)
      .slice(0, 3);
  }

  asignarPrecios(meals: any[]) {
    const actuales = { ...this.precios() };

    for (const m of meals) {
      if (!actuales[m.idMeal]) {
        actuales[m.idMeal] = this.generarPrecio(m.idMeal);
      }
    }

    this.precios.set(actuales);
  }

  
  private hashId(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  generarPrecio(id: string): number {
    const minimo = 15000;
    const maximo = 35000;
    const pasos = Math.floor((maximo - minimo) / 500);
    const indice = this.hashId(id) % (pasos + 1);
    return minimo + indice * 500;
  }

  precioDe(idMeal: string): number {
    return this.precios()[idMeal] ?? 0;
  }

  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  cargarDetalle(idMeal: string, event: Event) {
    const abierto = (event.target as HTMLDetailsElement).open;

    if (!abierto || this.detalleCache()[idMeal]) return;

    this.serviciosApi.buscarPorId(idMeal).subscribe(res => {
      const meal = res.meals[0];
      const entidad = entidadComidas.desdeApi(meal, this.precioDe(idMeal));

      this.detalleCache.update(cache => ({
        ...cache,
        [idMeal]: entidad
      }));
    });
  }

  ingredientes(idMeal: string): string[] {
    return this.detalleCache()[idMeal]?.ingredientes ?? [];
  }

  buscarPorNombre() {
    const texto = this.nombreBusqueda.trim();
    if (!texto) return;

    this.prepararBusqueda();
    this.ingredienteBusqueda = '';

    this.serviciosApi.buscarPorNombre(texto).subscribe(res => this.mostrarResultados(res.meals));
  }

  buscarPorIngrediente() {
    const texto = this.ingredienteBusqueda.trim();
    if (!texto) return;

    this.prepararBusqueda();
    this.nombreBusqueda = '';

    this.serviciosApi.buscarPorIngrediente(texto).subscribe(res => this.mostrarResultados(res.meals));
  }

  private prepararBusqueda() {
    this.buscando.set(true);
    this.modoBusqueda.set(true);
  }

  private mostrarResultados(meals: any[] | null) {
    const crudos = meals ?? [];
    this.asignarPrecios(crudos);

    const entidades = crudos.map(m => entidadComidas.desdeApi(m, this.precioDe(m.idMeal)));

    this.resultadosBusqueda.set(entidades);
    this.sinResultados.set(entidades.length === 0);
    this.buscando.set(false);

   
    crudos.forEach((crudo, i) => {
      if (crudo.strIngredient1) {
        const entidad = entidades[i];
        this.detalleCache.update(cache => ({ ...cache, [entidad.idMeal]: entidad }));
      }
    });
  }

  limpiar() {
    this.nombreBusqueda = '';
    this.ingredienteBusqueda = '';
    this.modoBusqueda.set(false);
    this.resultadosBusqueda.set([]);
    this.sinResultados.set(false);
  }

  agregarAlPedido(meal: entidadComidas) {
    this.carrito.agregar({
      id: meal.idMeal,
      tipo: 'comida',
      nombre: meal.strMeal,
      imagen: meal.strMealThumb,
      precio: meal.precio
    });
  }
}
