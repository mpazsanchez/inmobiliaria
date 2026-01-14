export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  fotoUrl: string;
  passwordHash: string;
  activo: boolean;
  fechaRegistro: string;
}
