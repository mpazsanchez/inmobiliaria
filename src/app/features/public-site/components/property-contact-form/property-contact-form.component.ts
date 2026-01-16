import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PropertyContactData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  propiedadId: number;
  propiedadTitulo: string;
}

@Component({
  selector: 'app-property-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-contact-form.component.html',
  styleUrl: './property-contact-form.component.scss'
})
export class PropertyContactFormComponent {
  @Input() propiedadId!: number;
  @Input() propiedadTitulo: string = '';
  @Input() agenteEmail: string = '';
  @Output() formSubmit = new EventEmitter<PropertyContactData>();

  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,}$/)]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Mensaje predefinido
    this.contactForm.patchValue({
      mensaje: `Hola, me interesa esta propiedad y quisiera recibir más información. ¿Podemos coordinar una visita?`
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      Object.keys(this.f).forEach(key => {
        this.f[key].markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;

    const formData: PropertyContactData = {
      ...this.contactForm.value,
      propiedadId: this.propiedadId,
      propiedadTitulo: this.propiedadTitulo
    };

    // Simulamos el envío
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.formSubmit.emit(formData);

      // Reset después de unos segundos
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }
}
