export interface ItemPedido {
    id: string;
    tipo: 'comida' | 'bebida';
    nombre: string;
    imagen: string;
    precio: number;
    cantidad: number;
}

export class entidadPedidos implements ItemPedido {
    id: string = '';
    tipo: 'comida' | 'bebida' = 'comida';
    nombre: string = '';
    imagen: string = '';
    precio: number = 0;
    cantidad: number = 0;
}

export interface DatosCliente {
    nombreCompleto: string;
    celular: string;
    direccion: string;
}
