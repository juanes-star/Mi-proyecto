import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComidaApi } from '../servicios/comida-api';
import { entidadComidas } from '../entidades/entidad-comidas';


const ID_PLATO_ESTRELLA = '52772'; 

@Component({
  selector: 'app-mejores-comida',
  imports: [CommonModule],
  templateUrl: './mejores-comida.html',
  styleUrl: './mejores-comida.css',
})
export class MejoresComida implements OnInit {

  plato = signal<entidadComidas | null>(null);
  cargando = signal(true);

  constructor(private comidaApi: ComidaApi) { }

  ngOnInit(): void {
    this.comidaApi.buscarPorId(ID_PLATO_ESTRELLA).subscribe({
      next: res => {
        const meal = res.meals?.[0];
        if (meal) {
          const precio = this.generarPrecio(meal.idMeal);
          this.plato.set(entidadComidas.desdeApi(meal, precio));
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
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

  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  ingredientesDestacados() {
    return this.plato()?.ingredientes ?? [];
  }
}
