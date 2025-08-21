export interface Certification {
  id: string;
  name: string;
  description: string;
  status: 'pendiente' | 'completado' | 'descargado';
  dateCompleted?: string;
  certificateUrl?: string;
}
