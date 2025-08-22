import { Injectable } from '@angular/core';
import { Installer } from '../models/installer.interface';

@Injectable({ providedIn: 'root' })
export class InstallerDerivationService {
  async getInstallers(): Promise<Installer[]> {
    // Simulación: datos mock
    return [
      { id: '1', name: 'Juan Pérez', location: 'Buenos Aires', email: 'juan@glazing.com', phone: '+54 11 1234-5678', lat: -34.6037, lng: -58.3816 },
      { id: '2', name: 'Ana García', location: 'Madrid', email: 'ana@glazing.com', phone: '+34 91 123 4567', lat: 40.4168, lng: -3.7038 },
      { id: '3', name: 'Carlos López', location: 'Córdoba', email: 'carlos@glazing.com', phone: '+54 351 123-4567', lat: -31.4201, lng: -64.1888 }
    ];
  }

  findNearest(userLocation: string, installers: Installer[]): Installer | null {
    // Simulación: búsqueda por coincidencia de ciudad
    const found = installers.find(i => i.location.toLowerCase().includes(userLocation.toLowerCase()));
    return found || null;
  }
}
