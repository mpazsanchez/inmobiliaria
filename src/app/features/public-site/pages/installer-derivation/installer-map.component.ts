import { Component, Input } from '@angular/core';
import { Installer } from '../../models/installer.interface';

@Component({
  selector: 'app-installer-map',
  standalone: true,
  templateUrl: './installer-map.component.html',
  styleUrls: ['./installer-map.component.scss'],
})
export class InstallerMapComponent {
  @Input() installers: Installer[] = [];
  @Input() selectedInstaller: Installer | null = null;
}
