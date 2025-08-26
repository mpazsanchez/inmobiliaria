import { Component, signal, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { InstallerMapComponent } from './installer-map.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Installer } from '../../models/installer.interface';
import { InstallerDerivationService } from '../../services/installer-derivation.service';

@Component({
  selector: 'app-installer-derivation',
  standalone: true,
  templateUrl: './installer-derivation.component.html',
  styleUrls: ['./installer-derivation.component.scss'],
  imports: [InstallerMapComponent, ReactiveFormsModule]
})
export class InstallerDerivationComponent {
  private service = inject(InstallerDerivationService);
  installers = signal<Installer[]>([]);
  userLocationControl = new FormControl('');
  nearestInstaller = signal<Installer | null>(null);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {}

  async ngOnInit() {
    await this.loadInstallers();
    if (this.isBrowser) {
      await this.detectUserLocation();
    }
  }

  async detectUserLocation() {
    // Intentar obtener ubicación por geolocalización del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Usar Nominatim para reverse geocoding
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
        if (city) {
          this.userLocationControl.setValue(city);
        }
      }, async () => {
        // Fallback: obtener ubicación por IP
        const ipRes = await fetch('https://ipapi.co/json');
        const ipData = await ipRes.json();
        if (ipData.city) {
          this.userLocationControl.setValue(ipData.city);
        }
      });
    } else {
      // Fallback: obtener ubicación por IP
      const ipRes = await fetch('https://ipapi.co/json');
      const ipData = await ipRes.json();
      if (ipData.city) {
        this.userLocationControl.setValue(ipData.city);
      }
    }
  }

  async loadInstallers() {
    this.installers.set(await this.service.getInstallers());
  }

  findNearestInstaller() {
    const location = this.userLocationControl.value?.trim();
    if (!location) return;
    this.nearestInstaller.set(this.service.findNearest(location, this.installers()));
  }
}
