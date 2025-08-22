import { Component, signal, inject } from '@angular/core';

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

  constructor() {
    this.loadInstallers();
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
