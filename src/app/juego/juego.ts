import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ComidaApi } from '../servicios/comida-api';
import { BebidasApi } from '../servicios/bebidas-api';

interface Celda {
  indice: number;
  tipo: 'comida' | 'bebida' | null;
  imagen: string | null;
  descubierta: boolean;
}

@Component({
  selector: 'app-juego',
  imports: [CommonModule],
  templateUrl: './juego.html',
  styleUrl: './juego.css',
})
export class Juego implements OnInit {

  celdas = signal<Celda[]>([]);
  intentos = signal(0);
  encontrados = signal(0);
  gano = signal(false);
  cargando = signal(true);

  constructor(private comidaApi: ComidaApi, private bebidasApi: BebidasApi) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.cargando.set(true);
    this.gano.set(false);
    this.intentos.set(0);
    this.encontrados.set(0);

    forkJoin({
      comida: this.comidaApi.buscarAleatorio(),
      bebida: this.bebidasApi.buscarAleatorio()
    }).subscribe(({ comida, bebida }) => {
      const imagenComida = comida.meals[0].strMealThumb;
      const imagenBebida = bebida.drinks[0].strDrinkThumb;

      const [posicionComida, posicionBebida] = this.generarPosiciones();

      const nuevasCeldas: Celda[] = Array.from({ length: 16 }, (_, i) => ({
        indice: i,
        tipo: null,
        imagen: null,
        descubierta: false
      }));

      nuevasCeldas[posicionComida] = { indice: posicionComida, tipo: 'comida', imagen: imagenComida, descubierta: false };
      nuevasCeldas[posicionBebida] = { indice: posicionBebida, tipo: 'bebida', imagen: imagenBebida, descubierta: false };

      this.celdas.set(nuevasCeldas);
      this.cargando.set(false);
    });
  }

  private generarPosiciones(): [number, number] {
    const a = Math.floor(Math.random() * 16);
    let b = Math.floor(Math.random() * 16);

    while (b === a) {
      b = Math.floor(Math.random() * 16);
    }

    return [a, b];
  }

  voltear(celda: Celda) {
    if (celda.descubierta || this.gano()) return;

    this.intentos.update(v => v + 1);

    this.celdas.update(lista =>
      lista.map(c => c.indice === celda.indice ? { ...c, descubierta: true } : c)
    );

    if (celda.tipo) {
      this.encontrados.update(v => v + 1);

      if (this.encontrados() === 2) {
        this.gano.set(true);
        setTimeout(() => this.iniciarJuego(), 2500);
      }
    }
  }
}
