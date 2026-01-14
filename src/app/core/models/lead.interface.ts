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
}
