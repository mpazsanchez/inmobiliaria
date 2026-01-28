import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Notificacion,
  ResumenNotificaciones,
  FiltrosNotificaciones,
  TipoNotificacion,
  PrioridadNotificacion
} from '../models/notificacion.interface';

/**
 * Servicio para gestión de notificaciones
 * - Obtener notificaciones del usuario actual
 * - Marcar como leídas
 * - Polling automático cada 30 segundos
 * - Modo mock con datos simulados
 */
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = `${environment.apiUrl}/notificaciones`;
  private useMockMode = true; // Cambiar a false cuando haya backend real

  // Estado reactivo
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  // Signals para el componente
  notificaciones = signal<Notificacion[]>([]);
  resumen = computed(() => this.calcularResumen(this.notificaciones()));

  // Control de polling
  private pollingInterval = 30000; // 30 segundos
  private pollingActive = false;

  constructor() {
    this.iniciarPolling();
  }

  // =============================================
  // OBTENER NOTIFICACIONES
  // =============================================
  getNotificaciones(filtros: FiltrosNotificaciones = {}): Observable<Notificacion[]> {
    if (this.useMockMode) {
      return this.getMockNotificaciones(filtros);
    }

    const params = this.construirParams(filtros);
    return this.http.get<Notificacion[]>(this.apiUrl, { params }).pipe(
      tap(notifs => {
        this.notificaciones.set(notifs);
        this.notificacionesSubject.next(notifs);
      }),
      catchError(() => of([]))
    );
  }

  // =============================================
  // MARCAR COMO LEÍDA
  // =============================================
  marcarComoLeida(id: number): Observable<void> {
    if (this.useMockMode) {
      return this.mockMarcarLeida(id);
    }

    return this.http.patch<void>(`${this.apiUrl}/${id}/leer`, {}).pipe(
      tap(() => this.actualizarNotificacionLocal(id, { leida: true }))
    );
  }

  // =============================================
  // MARCAR TODAS COMO LEÍDAS
  // =============================================
  marcarTodasComoLeidas(): Observable<void> {
    if (this.useMockMode) {
      return this.mockMarcarTodasLeidas();
    }

    return this.http.patch<void>(`${this.apiUrl}/leer-todas`, {}).pipe(
      tap(() => {
        const actualizadas = this.notificaciones().map(n => ({ ...n, leida: true }));
        this.notificaciones.set(actualizadas);
      })
    );
  }

  // =============================================
  // ELIMINAR NOTIFICACIÓN
  // =============================================
  eliminarNotificacion(id: number): Observable<void> {
    if (this.useMockMode) {
      return this.mockEliminarNotificacion(id);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const filtradas = this.notificaciones().filter(n => n.id !== id);
        this.notificaciones.set(filtradas);
      })
    );
  }

  // =============================================
  // POLLING AUTOMÁTICO
  // =============================================
  private iniciarPolling(): void {
    if (this.pollingActive) return;
    
    this.pollingActive = true;
    
    // Primera carga inmediata
    this.getNotificaciones({ limite: 50 }).subscribe();

    // Polling cada 30 segundos
    interval(this.pollingInterval)
      .pipe(switchMap(() => this.getNotificaciones({ limite: 50 })))
      .subscribe();
  }

  detenerPolling(): void {
    this.pollingActive = false;
  }

  // =============================================
  // HELPERS
  // =============================================
  private calcularResumen(notificaciones: Notificacion[]): ResumenNotificaciones {
    const noLeidas = notificaciones.filter(n => !n.leida);
    
    const porTipo: { [key in TipoNotificacion]?: number } = {};
    notificaciones.forEach(n => {
      porTipo[n.tipo] = (porTipo[n.tipo] || 0) + 1;
    });

    return {
      total: notificaciones.length,
      noLeidas: noLeidas.length,
      porTipo
    };
  }

  private actualizarNotificacionLocal(id: number, cambios: Partial<Notificacion>): void {
    const actualizadas = this.notificaciones().map(n =>
      n.id === id ? { ...n, ...cambios } : n
    );
    this.notificaciones.set(actualizadas);
    this.notificacionesSubject.next(actualizadas);
  }

  private construirParams(filtros: FiltrosNotificaciones): any {
    const params: any = {};
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.leida !== undefined) params.leida = filtros.leida;
    if (filtros.prioridad) params.prioridad = filtros.prioridad;
    if (filtros.desde) params.desde = filtros.desde;
    if (filtros.hasta) params.hasta = filtros.hasta;
    if (filtros.limite) params.limite = filtros.limite;
    return params;
  }

  // =============================================
  // MODO MOCK (SIN BACKEND)
  // =============================================
  private getMockNotificaciones(filtros: FiltrosNotificaciones): Observable<Notificacion[]> {
    const mockData: Notificacion[] = [
      {
        id: 1,
        tipo: 'nueva_consulta',
        titulo: 'Nueva Consulta Recibida',
        mensaje: 'María González consultó sobre "Departamento en Palermo"',
        prioridad: 'alta',
        leida: false,
        fechaCreacion: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
        usuarioId: 1,
        enlace: '/member-area/notificaciones',
        icono: 'bi-envelope',
        entidadId: 1,
        entidadTipo: 'lead'
      },
      {
        id: 2,
        tipo: 'asignacion_lead',
        titulo: 'Lead Asignado',
        mensaje: 'Se te asignó el lead de Carlos Martínez',
        prioridad: 'media',
        leida: false,
        fechaCreacion: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
        usuarioId: 1,
        enlace: '/member-area/notificaciones',
        icono: 'bi-person-check',
        entidadId: 2,
        entidadTipo: 'lead'
      },
      {
        id: 3,
        tipo: 'propiedad_vendida',
        titulo: 'Propiedad Vendida',
        mensaje: 'La propiedad "Casa en Recoleta" fue marcada como vendida',
        prioridad: 'alta',
        leida: true,
        fechaCreacion: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        usuarioId: 1,
        enlace: '/member-area/propiedades/5',
        icono: 'bi-house-check',
        entidadId: 5,
        entidadTipo: 'propiedad'
      },
      {
        id: 4,
        tipo: 'nuevo_usuario',
        titulo: 'Nuevo Usuario Registrado',
        mensaje: 'Laura Rodríguez se registró como asesora',
        prioridad: 'baja',
        leida: true,
        fechaCreacion: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
        usuarioId: 1,
        enlace: '/member-area/usuarios/10',
        icono: 'bi-person-plus',
        entidadId: 10,
        entidadTipo: 'usuario'
      },
      {
        id: 5,
        tipo: 'vencimiento_propiedad',
        titulo: 'Propiedad Próxima a Vencer',
        mensaje: 'La publicación de "Oficina en Microcentro" vence en 3 días',
        prioridad: 'media',
        leida: false,
        fechaCreacion: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
        usuarioId: 1,
        enlace: '/member-area/propiedades/12',
        icono: 'bi-clock-history',
        entidadId: 12,
        entidadTipo: 'propiedad'
      }
    ];

    // Aplicar filtros
    let resultado = [...mockData];
    
    if (filtros.tipo) {
      resultado = resultado.filter(n => n.tipo === filtros.tipo);
    }
    if (filtros.leida !== undefined) {
      resultado = resultado.filter(n => n.leida === filtros.leida);
    }
    if (filtros.prioridad) {
      resultado = resultado.filter(n => n.prioridad === filtros.prioridad);
    }
    if (filtros.limite) {
      resultado = resultado.slice(0, filtros.limite);
    }

    // Actualizar estado
    this.notificaciones.set(resultado);
    this.notificacionesSubject.next(resultado);

    return of(resultado);
  }

  private mockMarcarLeida(id: number): Observable<void> {
    this.actualizarNotificacionLocal(id, { leida: true });
    return of(void 0);
  }

  private mockMarcarTodasLeidas(): Observable<void> {
    const actualizadas = this.notificaciones().map(n => ({ ...n, leida: true }));
    this.notificaciones.set(actualizadas);
    this.notificacionesSubject.next(actualizadas);
    return of(void 0);
  }

  private mockEliminarNotificacion(id: number): Observable<void> {
    const filtradas = this.notificaciones().filter(n => n.id !== id);
    this.notificaciones.set(filtradas);
    this.notificacionesSubject.next(filtradas);
    return of(void 0);
  }

  // =============================================
  // CONFIGURACIÓN
  // =============================================
  setPollingInterval(milisegundos: number): void {
    this.pollingInterval = milisegundos;
  }

  isMockMode(): boolean {
    return this.useMockMode;
  }
}
