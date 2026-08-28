import { Routes } from '@angular/router';
import { Bebidas } from './bebidas/bebidas';
import { Comidas } from './comidas/comidas';
import { Juego } from './juego/juego';
import { Pedidos } from './pedidos/pedidos';


export const routes: Routes = [
    { path: 'bebidas', component: Bebidas },
    { path: 'comidas', component: Comidas },
    { path: 'juego', component: Juego },
    { path: 'pedidos', component: Pedidos },
    { path: '**', redirectTo: '' }
];
