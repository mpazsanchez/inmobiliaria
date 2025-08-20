import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-installer-form',
  standalone: true,
  templateUrl: './installer-form.component.html',
  styleUrls: ['./installer-form.component.scss'],
  imports: [ReactiveFormsModule]
})
export class InstallerFormComponent {
  motivoControl = new FormControl('');
  @Output() submitForm = new EventEmitter<string>();

  submit() {
    if (this.motivoControl.value) {
      this.submitForm.emit(this.motivoControl.value);
      this.motivoControl.reset();
    }
  }
}
