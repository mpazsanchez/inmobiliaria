export interface Contacto {
  id: number;
  propiedadId: number;
  asesorId: number;
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  mensaje: string;
  fechaEnvio: string;
  respondida: boolean;
  /** Token de reCAPTCHA Enterprise (opcional, solo en envío) */
  recaptchaToken?: string;
}
