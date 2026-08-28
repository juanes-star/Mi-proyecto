import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Carrito } from '../servicios/carrito';
import { DatosCliente } from '../entidades/entidad-pedidos';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos {

  datosCliente: DatosCliente = {
    nombreCompleto: '',
    celular: '',
    direccion: ''
  };

  pedidoGenerado = signal(false);
  generando = signal(false);

  constructor(public carrito: Carrito) { }

  formatearPrecio(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  subtotal(precio: number, cantidad: number): number {
    return precio * cantidad;
  }

  aumentar(id: string, cantidadActual: number) {
    this.carrito.cambiarCantidad(id, cantidadActual + 1);
  }

  disminuir(id: string, cantidadActual: number) {
    this.carrito.cambiarCantidad(id, cantidadActual - 1);
  }

  quitar(id: string) {
    this.carrito.quitar(id);
  }

  realizarPedido(formulario: NgForm) {
    if (formulario.invalid || this.carrito.items().length === 0) {
      Object.values(formulario.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.generando.set(true);
    this.pedidoGenerado.set(false);

    this.generarPdf().then(() => {
      this.generando.set(false);
      this.pedidoGenerado.set(true);
      this.carrito.vaciar();
      formulario.resetForm();
    });
  }

  private cargarImagenBase64(ruta: string): Promise<string | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = ruta;
    });
  }

  private async generarPdf() {
    const doc = new jsPDF();
    const items = this.carrito.items();
    const total = this.carrito.total();
    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const logo = await this.cargarImagenBase64('/logo.png');

    let y = 15;

    if (logo) {
      doc.addImage(logo, 'PNG', 15, y, 22, 22);
    }

    doc.setFontSize(20);
    doc.setTextColor(107, 68, 35);
    doc.text('MANILA', 105, y + 8, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Formato de pedido', 105, y + 16, { align: 'center' });

    y += 30;
    doc.setDrawColor(107, 68, 35);
    doc.line(15, y, 195, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Fecha: ${fecha}`, 15, y);
    y += 8;
    doc.text(`Cliente: ${this.datosCliente.nombreCompleto}`, 15, y);
    y += 7;
    doc.text(`Celular: ${this.datosCliente.celular}`, 15, y);
    y += 7;
    doc.text(`Dirección: ${this.datosCliente.direccion}`, 15, y);

    y += 10;
    doc.line(15, y, 195, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 15, y);
    doc.text('Cant.', 120, y);
    doc.text('Precio', 145, y);
    doc.text('Subtotal', 175, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    doc.line(15, y, 195, y);
    y += 7;

    for (const item of items) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const nombreCorto = item.nombre.length > 35 ? item.nombre.slice(0, 32) + '...' : item.nombre;
      doc.text(nombreCorto, 15, y);
      doc.text(String(item.cantidad), 122, y);
      doc.text(this.formatearPrecio(item.precio), 145, y);
      doc.text(this.formatearPrecio(item.precio * item.cantidad), 175, y);
      y += 7;
    }

    y += 3;
    doc.line(15, y, 195, y);
    y += 10;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total a pagar: ${this.formatearPrecio(total)}`, 195, y, { align: 'right' });

    y += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('Gracias por tu pedido en MANILA.', 105, y, { align: 'center' });

    doc.save(`pedido-manila-${Date.now()}.pdf`);
  }
}
