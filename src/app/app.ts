import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navegacion } from "./navegacion/navegacion";
import { Footer } from "./footer/footer";
import { filter } from 'rxjs';
import { InformacionInicio } from './informacion-inicio/informacion-inicio';
import { CarrucelInicio } from './carrucel-inicio/carrucel-inicio';
import { MejoresBebidas } from './mejores-bebidas/mejores-bebidas';
import { MejoresComida } from './mejores-comida/mejores-comida';

@Component({
  selector: 'app-root',
  imports: [Navegacion, Footer, InformacionInicio, CarrucelInicio , MejoresBebidas, MejoresComida],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Mi-Proyecto');
  private router = inject(Router);
  esRutaInicio = true;

  constructor() {
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
       
        this.esRutaInicio = event.urlAfterRedirects === '/' ;
      });
  }
}
