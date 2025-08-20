export type UserRole = 'comprador' | 'instalador-en-formacion' | 'instalador-certificado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
