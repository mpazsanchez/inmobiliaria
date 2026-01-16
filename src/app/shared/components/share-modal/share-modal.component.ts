import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Propiedad } from '../../../core/models/property.interface';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss'
})
export class ShareModalComponent {
  @Input() property: Propiedad | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  linkCopied = false;

  close(): void {
    this.closed.emit();
  }

  formatearPrecio(precio: number, moneda: string): string {
    const simbolo = moneda === 'USD' ? 'US$' : '$';
    return `${simbolo} ${precio.toLocaleString('es-AR')}`;
  }

  shareOn(platform: string): void {
    if (!this.property) return;

    const url = `${window.location.origin}/propiedad/${this.property.id}`;
    const text = `${this.property.titulo} - ${this.formatearPrecio(this.property.precio, this.property.moneda)}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
  }

  async copyLink(): Promise<void> {
    if (!this.property) return;

    const url = `${window.location.origin}/propiedad/${this.property.id}`;

    try {
      await navigator.clipboard.writeText(url);
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }
}
