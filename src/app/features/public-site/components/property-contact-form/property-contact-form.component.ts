import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../../../core/services/lead.service';
import { RecaptchaService } from '../../../../core/services/recaptcha.service';

export interface PropertyContactData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  propiedadId: number;
  propiedadTitulo: string;
  agenteId?: number;
  agenteNombre?: string;
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
  @Input() agenteId: number = 0;
  @Input() agenteNombre: string = '';
  @Input() agenteEmail: string = '';
  @Output() formSubmit = new EventEmitter<PropertyContactData>();

  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  private readonly fb = inject(FormBuilder);
  private readonly leadService = inject(LeadService);

  constructor() {
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
    this.submitSuccess = false;

    const formData: PropertyContactData = {
      ...this.contactForm.value,
      propiedadId: this.propiedadId,
      propiedadTitulo: this.propiedadTitulo,
      agenteId: this.agenteId,
      agenteNombre: this.agenteNombre
    };

    // Incluir información del agente en el mensaje para referencia
    const mensajeCompleto = this.agenteNombre
      ? `${this.contactForm.value.mensaje}\n\n[Propiedad: ${this.propiedadTitulo} - Agente: ${this.agenteNombre}]`
      : this.contactForm.value.mensaje;

    this.leadService.submitInquiry({
      propiedadId: this.propiedadId,
      asesorId: this.agenteId,
      nombreContacto: this.contactForm.value.nombre,
      emailContacto: this.contactForm.value.email,
      telefonoContacto: this.contactForm.value.telefono,
      mensaje: mensajeCompleto
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.formSubmit.emit(formData);
        this.contactForm.reset();

        // Restaurar mensaje predefinido
        this.contactForm.patchValue({
          mensaje: `Hola, me interesa esta propiedad y quisiera recibir más información. ¿Podemos coordinar una visita?`
        });

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      },
      error: (err: Error) => {
        console.error('Error al enviar consulta:', err);
        this.isSubmitting = false;
        this.submitError = true;

        // Ocultar mensaje de error después de 5 segundos
        setTimeout(() => {
          this.submitError = false;
        }, 5000);
      }
    });
  }
}
