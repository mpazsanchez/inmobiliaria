import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/agentes';

  // =============================================
  // OBTENER TODOS LOS AGENTES
  // =============================================

}
