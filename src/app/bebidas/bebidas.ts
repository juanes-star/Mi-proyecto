import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BebidasApi } from '../servicios/bebidas-api';
import { Carrito } from '../servicios/carrito';
import { EntidadBebidas } from '../entidades/entidad-bebidas';

@Component({
  selector: 'app-bebidas',
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.html',
  styleUrl: './bebidas.css',
})
export class Bebidas implements OnInit {

  categoriasApi = signal<any[]>([]);
  verApi = signal<EntidadBebidas[]>([]);

  detalleCache = signal<Record<string, EntidadBebidas>>({});
  precios = signal<Record<string, number>>({});

  nombreBusqueda = '';
  ingredienteBusqueda = '';
  tipoSeleccionado = '';
  categoriaSeleccionada = '';

  modoBusqueda = signal(false);
  resultadosBusqueda = signal<EntidadBebidas[]>([]);
  buscando = signal(false);
  sinResultados = signal(false);

  constructor(private serviciosApi: BebidasApi, private carrito: Carrito) { }

  ngOnInit(): void {
    this.bebidasCategoria();
  }

  bebidasCategoria() {
    this.serviciosApi.listarCategorias().subscribe(categorias => {
      this.categoriasApi.set(categorias.drinks);
      this.ver();
    });
  }

  ver() {
    for (let i = 0; i < this.categoriasApi().length; i++) {
      const categoria: string = this.categoriasApi()[i].strCategory;

      this.serviciosApi.bebidasPorCategoria(categoria).subscribe(dato => {
        const drinksConCategoria = (dato.drinks ?? []).map((d: any) => ({
          ...d,
          strCategory: categoria
        }));

        this.asignarPrecios(drinksConCategoria);

        const entidades = drinksConCategoria.map((d: any) =>
          EntidadBebidas.desdeApi(d, this.precioDe(d.idDrink))
        );

        this.verApi.update(actual => [...actual, ...entidades]);
      });
    }
  }

  drinksPorCategoria(categoria: string): EntidadBebidas[] {
    return this.verApi()
      .filter(d => d.strCategory === categoria)
      .slice(0, 3);
  }

  asignarPrecios(drinks: any[]) {
    const actuales = { ...this.precios() };

    for (const d of drinks) {
      if (!actuales[d.idDrink]) {
        actuales[d.idDrink] = this.generarPrecio(d.idDrink);
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
    const minimo = 10000;
    const maximo = 25000;
    const pasos = Math.floor((maximo - minimo) / 500);
    const indice = this.hashId(id) % (pasos + 1);
    return minimo + indice * 500;
  }

  precioDe(idDrink: string): number {
    return this.precios()[idDrink] ?? 0;
  }

  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  cargarDetalle(idDrink: string, event: Event) {
    const abierto = (event.target as HTMLDetailsElement).open;

    if (!abierto || this.detalleCache()[idDrink]) return;

    this.serviciosApi.buscarPorId(idDrink).subscribe(res => {
      const drink = res.drinks[0];
      const entidad = EntidadBebidas.desdeApi(drink, this.precioDe(idDrink));

      this.detalleCache.update(cache => ({
        ...cache,
        [idDrink]: entidad
      }));
    });
  }

  ingredientes(idDrink: string): string[] {
    return this.detalleCache()[idDrink]?.ingredientes ?? [];
  }

  buscarPorNombre() {
    const texto = this.nombreBusqueda.trim();
    if (!texto) return;

    this.prepararBusqueda();
    this.ingredienteBusqueda = '';
    this.tipoSeleccionado = '';
    this.categoriaSeleccionada = '';

    this.serviciosApi.buscarPorNombre(texto).subscribe(res => this.mostrarResultados(res.drinks));
  }

  buscarPorIngrediente() {
    const texto = this.ingredienteBusqueda.trim();
    if (!texto) return;

    this.prepararBusqueda();
    this.nombreBusqueda = '';
    this.tipoSeleccionado = '';
    this.categoriaSeleccionada = '';

    this.serviciosApi.buscarPorIngrediente(texto).subscribe(res => this.mostrarResultados(res.drinks));
  }

  filtrarPorTipo() {
    if (!this.tipoSeleccionado) { this.limpiar(); return; }

    this.prepararBusqueda();
    this.nombreBusqueda = '';
    this.ingredienteBusqueda = '';
    this.categoriaSeleccionada = '';

    this.serviciosApi.filtrarPorAlcohol(this.tipoSeleccionado).subscribe(res => this.mostrarResultados(res.drinks));
  }

  filtrarPorCategoria() {
    if (!this.categoriaSeleccionada) { this.limpiar(); return; }

    this.prepararBusqueda();
    this.nombreBusqueda = '';
    this.ingredienteBusqueda = '';
    this.tipoSeleccionado = '';

    this.serviciosApi.bebidasPorCategoria(this.categoriaSeleccionada).subscribe(res => this.mostrarResultados(res.drinks));
  }

  private prepararBusqueda() {
    this.buscando.set(true);
    this.modoBusqueda.set(true);
  }

  private mostrarResultados(drinks: any[] | null) {
    const crudos = drinks ?? [];
    this.asignarPrecios(crudos);

    const entidades = crudos.map(d => EntidadBebidas.desdeApi(d, this.precioDe(d.idDrink)));

    this.resultadosBusqueda.set(entidades);
    this.sinResultados.set(entidades.length === 0);
    this.buscando.set(false);

   
    crudos.forEach((crudo, i) => {
      if (crudo.strIngredient1) {
        const entidad = entidades[i];
        this.detalleCache.update(cache => ({ ...cache, [entidad.idDrink]: entidad }));
      }
    });
  }

  limpiar() {
    this.nombreBusqueda = '';
    this.ingredienteBusqueda = '';
    this.tipoSeleccionado = '';
    this.categoriaSeleccionada = '';
    this.modoBusqueda.set(false);
    this.resultadosBusqueda.set([]);
    this.sinResultados.set(false);
  }

  agregarAlPedido(drink: EntidadBebidas) {
    this.carrito.agregar({
      id: drink.idDrink,
      tipo: 'bebida',
      nombre: drink.strDrink,
      imagen: drink.strDrinkThumb,
      precio: drink.precio
    });
  }
}
