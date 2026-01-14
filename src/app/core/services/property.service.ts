import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = '/api/propiedades'; // TODO: configurar en environment

  // =============================================
  // OBTENER PROPIEDADES CON FILTROS
  // =============================================

  // =============================================
  // OBTENER PROPIEDAD POR ID O SLUG
  // =============================================


  // =============================================
  // PROPIEDADES DESTACADAS
  // =============================================


  // =============================================
  // PROPIEDADES RECIENTES
  // =============================================


  // =============================================
  // PROPIEDADES RELACIONADAS
  // =============================================


  // =============================================
  // CONTADORES RAPIDOS
  // =============================================

}
