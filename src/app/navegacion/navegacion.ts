import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Carrito } from '../servicios/carrito';


@Component({
  selector: 'app-navegacion',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion {
  constructor(public carrito: Carrito) { }
}
