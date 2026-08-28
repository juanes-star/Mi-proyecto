import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BebidasApi } from '../servicios/bebidas-api';
import { EntidadBebidas } from '../entidades/entidad-bebidas';


const ID_BEBIDA_ESTRELLA = '11007'; 

@Component({
  selector: 'app-mejores-bebidas',
  imports: [CommonModule],
  templateUrl: './mejores-bebidas.html',
  styleUrl: './mejores-bebidas.css',
})
export class MejoresBebidas implements OnInit {

  bebida = signal<EntidadBebidas | null>(null);
  cargando = signal(true);

  constructor(private bebidasApi: BebidasApi) { }

  ngOnInit(): void {
    this.bebidasApi.buscarPorId(ID_BEBIDA_ESTRELLA).subscribe({
      next: res => {
        const drink = res.drinks?.[0];
        if (drink) {
          const precio = this.generarPrecio(drink.idDrink);
          this.bebida.set(EntidadBebidas.desdeApi(drink, precio));
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
    const minimo = 10000;
    const maximo = 25000;
    const pasos = Math.floor((maximo - minimo) / 500);
    const indice = this.hashId(id) % (pasos + 1);
    return minimo + indice * 500;
  }

  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  ingredientesDestacados(): string[] {
    return this.bebida()?.ingredientes ?? [];
  }
}
