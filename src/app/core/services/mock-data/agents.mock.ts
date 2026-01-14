import { Usuario } from '../../models/user.interface';

export const MOCK_ASESORES: Usuario[] = [
  {
    id: 1,
    nombre: 'Maria Garcia',
    email: 'maria.garcia@fairway.com',
    telefono: '+54 11 4555-1234',
    rol: 'asesor',
    fotoUrl: 'assets/images/agents/maria-garcia.jpg',
    passwordHash: '',
    activo: true,
    fechaRegistro: '2022-03-15'
  },
  {
    id: 2,
    nombre: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@fairway.com',
    telefono: '+54 11 4555-5678',
    rol: 'asesor',
    fotoUrl: 'assets/images/agents/carlos-rodriguez.jpg',
    passwordHash: '',
    activo: true,
    fechaRegistro: '2021-06-20'
  }
];
