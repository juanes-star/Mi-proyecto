import { Injectable, computed, signal } from '@angular/core';
import { ItemPedido } from '../entidades/entidad-pedidos';

@Injectable({
    providedIn: 'root'
})
export class Carrito {

    items = signal<ItemPedido[]>([]);

    total = computed(() =>
        this.items().reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0)
    );

    cantidadTotal = computed(() =>
        this.items().reduce((acumulado, item) => acumulado + item.cantidad, 0)
    );

    agregar(item: Omit<ItemPedido, 'cantidad'>, cantidad: number = 1) {
        const existente = this.items().find(i => i.id === item.id);

        if (existente) {
            this.items.update(lista =>
                lista.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
            );
        } else {
            this.items.update(lista => [...lista, { ...item, cantidad }]);
        }
    }

    cambiarCantidad(id: string, cantidad: number) {
        if (cantidad <= 0) {
            this.quitar(id);
            return;
        }

        this.items.update(lista =>
            lista.map(i => i.id === id ? { ...i, cantidad } : i)
        );
    }

    quitar(id: string) {
        this.items.update(lista => lista.filter(i => i.id !== id));
    }

    vaciar() {
        this.items.set([]);
    }
}
