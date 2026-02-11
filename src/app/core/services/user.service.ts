import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';
import {
  Usuario,
  PerfilAsesor,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  ReasignacionPropiedadesDto,
  RolUsuario
} from '../models/user.interface';
import { FiltrosUsuarios, RespuestaPaginada } from '../models/search-filters.interface';
import { PropertyService } from './property.service';

/**
 * Servicio para gestión de usuarios del sistema
 * Maneja CRUD de usuarios (asesores y administradores)
 * Lee de JSON mock y simula API REST para facilitar migración posterior
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private propertyService = inject(PropertyService);
  private jsonUrl = '/assets/data/usuarios.json';
  private useMockData = true; // Cambiar a false cuando API esté lista

  // Signals para estado
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Cache de usuarios
  private usuariosCache = signal<Usuario[]>([]);

  /**
   * Obtiene todos los usuarios del sistema con filtros y paginación
   * Solo disponible para administradores
   */
  getUsuarios(filtros?: FiltrosUsuarios): Observable<RespuestaPaginada<Usuario>> {
    this.loading.set(true);
    this.error.set(null);

    if (this.useMockData) {
      // Leer del JSON mock
      return this.http.get<{ usuarios: Usuario[] }>(this.jsonUrl).pipe(
        delay(500),
        map(response => {
          let usuarios: Usuario[] = response.usuarios || [];
          
          // Aplicar filtros
          usuarios = this.aplicarFiltros(usuarios, filtros);
          
          // Aplicar ordenamiento
          usuarios = this.aplicarOrdenamiento(usuarios, filtros);
          
          // Calcular paginación
          const pagina = filtros?.pagina || 1;
          const limite = filtros?.limite || filtros?.porPagina || 10;
          const totalItems = usuarios.length;
          const totalPaginas = Math.ceil(totalItems / limite);
          const inicio = (pagina - 1) * limite;
          const fin = inicio + limite;
          
          // Paginar resultados
          const usuariosPaginados = usuarios.slice(inicio, fin);
          
          this.usuariosCache.set(usuariosPaginados);
          this.loading.set(false);
          
          return {
            datos: usuariosPaginados,
            items: usuariosPaginados, // alias para compatibilidad
            total: totalItems,
            paginacion: {
              paginaActual: pagina,
              porPagina: limite,
              totalItems,
              totalPaginas,
              tieneSiguiente: pagina < totalPaginas,
              tieneAnterior: pagina > 1,
              total: totalItems
            }
          };
        }),
        catchError(err => {
          this.loading.set(false);
          this.error.set('Error al cargar usuarios');
          return throwError(() => err);
        })
      );
    }

    // Cuando tengamos API real:
    // return this.http.get<RespuestaPaginada<Usuario>>(`${this.apiUrl}/usuarios`, { params });
    return of({
      datos: [],
      items: [],
      total: 0,
      paginacion: {
        paginaActual: 1,
        porPagina: 10,
        totalItems: 0,
        totalPaginas: 0,
        tieneSiguiente: false,
        tieneAnterior: false,
        total: 0
      }
    });
  }

  /**
   * Aplica filtros a la lista de usuarios
   */
  private aplicarFiltros(usuarios: Usuario[], filtros?: FiltrosUsuarios): Usuario[] {
    if (!filtros) return usuarios;

    let resultado = [...usuarios];

    // Filtrar por búsqueda de texto (search o busqueda)
    const busqueda = filtros.search || filtros.busqueda;
    if (busqueda) {
      const search = busqueda.toLowerCase();
      resultado = resultado.filter(u =>
        u.nombre.toLowerCase().includes(search) ||
        u.apellido.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.perfilAsesor?.especialidad?.toLowerCase().includes(search)
      );
    }

    // Filtrar por rol
    if (filtros.rol) {
      resultado = resultado.filter(u => u.rol === filtros.rol);
    }

    // Filtrar por estado activo/inactivo
    if (filtros.activo !== undefined) {
      resultado = resultado.filter(u => u.activo === filtros.activo);
    }

    // Filtrar por destacado
    if (filtros.destacado !== undefined) {
      resultado = resultado.filter(u => u.destacado === filtros.destacado);
    }

    return resultado;
  }

  /**
   * Aplica ordenamiento a la lista de usuarios
   */
  private aplicarOrdenamiento(usuarios: Usuario[], filtros?: FiltrosUsuarios): Usuario[] {
    if (!filtros?.ordenarPor) {
      // Ordenamiento por defecto: más recientes primero
      return usuarios.sort((a, b) => 
        new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
      );
    }

    const direccion = filtros.ordenDireccion === 'desc' ? -1 : 1;

    return usuarios.sort((a, b) => {
      switch (filtros.ordenarPor) {
        case 'nombre':
          return direccion * a.nombre.localeCompare(b.nombre);
        case 'email':
          return direccion * a.email.localeCompare(b.email);
        case 'fechaRegistro':
          return direccion * (new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime());
        case 'ultimoAcceso':
          const aAcceso = a.ultimoAcceso ? new Date(a.ultimoAcceso).getTime() : 0;
          const bAcceso = b.ultimoAcceso ? new Date(b.ultimoAcceso).getTime() : 0;
          return direccion * (aAcceso - bAcceso);
        default:
          return 0;
      }
    });
  }

  /**
   * Obtiene usuarios filtrados por rol
   */
  getUsuariosPorRol(rol: RolUsuario): Observable<Usuario[]> {
    return this.getUsuarios({ rol, limite: 1000 }).pipe(
      map(respuesta => respuesta.datos)
    );
  }

  /**
   * Obtiene solo asesores activos
   */
  getAsesoresActivos(): Observable<Usuario[]> {
    return this.getUsuarios({ rol: 'asesor', activo: true, limite: 1000 }).pipe(
      map(respuesta => respuesta.datos)
    );
  }

  /**
   * Obtiene un usuario por ID
   */
  getUsuarioPorId(id: number): Observable<Usuario | null> {
    this.loading.set(true);

    if (this.useMockData) {
      return this.http.get<{ usuarios: Usuario[] }>(this.jsonUrl).pipe(
        delay(300),
        map(response => {
          const usuarios: Usuario[] = response.usuarios || [];
          const usuario = usuarios.find(u => u.id === id) || null;
          this.loading.set(false);
          return usuario;
        }),
        catchError(err => {
          console.error('[UserService] Error al obtener usuario:', err);
          this.loading.set(false);
          return of(null);
        })
      );
    }

    // Cuando tengamos API real:
    // return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
    return of(null);
  }

  /**
   * Crea un nuevo usuario
   * TODO: En mock solo simula, no persiste. Conectar con API real.
   */
  crearUsuario(dto: CrearUsuarioDto): Observable<Usuario> {
    this.loading.set(true);
    this.error.set(null);

    // Mock: simular creación
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Validar email único (solo simulado)
        console.warn('[MOCK] crearUsuario - No se persiste en JSON:', dto);

        // Crear nuevo usuario (temporal)
        const nuevoUsuario: Usuario = {
          id: Date.now(), // ID temporal
          email: dto.email,
          passwordHash: 'mock-hash',
          rol: dto.rol,
          activo: true,
          nombre: dto.nombre,
          apellido: dto.apellido,
          telefono: dto.telefono,
          fotoUrl: dto.fotoUrl || '/assets/images/default-avatar.svg',
          fechaRegistro: new Date().toISOString(),
          perfilAsesor: dto.rol === 'asesor' ? this.crearPerfilAsesorPorDefecto(dto.perfilAsesor) : undefined
        };

        this.loading.set(false);
        return nuevoUsuario;
      }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Actualiza un usuario existente
   * TODO: En mock solo simula, no persiste. Conectar con API real.
   */
  actualizarUsuario(id: number, dto: ActualizarUsuarioDto): Observable<Usuario> {
    this.loading.set(true);
    this.error.set(null);

    if (this.useMockData) {
      // Obtener usuario actual
      return this.getUsuarioPorId(id).pipe(
        delay(500),
        map(usuarioExistente => {
          if (!usuarioExistente) {
            this.loading.set(false);
            this.error.set('Usuario no encontrado');
            throw new Error('Usuario no encontrado');
          }

          console.warn('[MOCK] actualizarUsuario - No se persiste en JSON:', id, dto);

          // Actualizar campos (solo en memoria, no persiste)
          const usuarioActualizado: Usuario = {
            ...usuarioExistente,
            ...dto,
            // Si hay perfil asesor, merge con el existente
            perfilAsesor: dto.perfilAsesor 
              ? this.crearPerfilAsesorPorDefecto({
                  ...usuarioExistente.perfilAsesor,
                  ...dto.perfilAsesor
                })
              : usuarioExistente.perfilAsesor
          };

          this.loading.set(false);
          return usuarioActualizado;
        }),
        catchError(err => {
          this.loading.set(false);
          return throwError(() => err);
        })
      );
    }

    // Cuando tengamos API real:
    // return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, dto);
    return throwError(() => new Error('API no disponible'));
  }

  /**
   * Desactiva un usuario (soft delete)
   */
  desactivarUsuario(id: number): Observable<Usuario> {
    return this.actualizarUsuario(id, { activo: false });
  }

  /**
   * Reactiva un usuario
   */
  reactivarUsuario(id: number): Observable<Usuario> {
    return this.actualizarUsuario(id, { activo: true });
  }

  /**
   * Elimina un usuario permanentemente
   * TODO: En mock solo simula. Conectar con API real.
   */
  eliminarUsuario(id: number): Observable<void> {
    this.loading.set(true);
    
    console.warn('[MOCK] eliminarUsuario - No se persiste en JSON:', id);

    return of(void 0).pipe(
      delay(500),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Reasigna todas las propiedades de un usuario a otro (legacy - un solo destino)
   * TODO: En mock solo simula. Conectar con API real.
   */
  reasignarPropiedades(dto: ReasignacionPropiedadesDto): Observable<{ mensaje: string; cantidad: number }> {
    this.loading.set(true);

    console.warn('[MOCK] reasignarPropiedades - No se persiste:', dto);

    return of({
      mensaje: `Se reasignarían propiedades (mock)`,
      cantidad: dto.propiedadesIds?.length || 0
    }).pipe(
      delay(1000),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Reasigna propiedades a diferentes asesores (múltiples destinos)
   * Cada propiedad puede ir a un asesor distinto
   * 
   * API Endpoint: POST /api/usuarios/{usuarioOrigenId}/propiedades/reasignar
   * Request Body:
   * {
   *   "asignaciones": [
   *     { "propiedadId": 1, "nuevoAsesorId": 4 },
   *     { "propiedadId": 2, "nuevoAsesorId": 5 }
   *   ]
   * }
   * 
   * Response:
   * {
   *   "mensaje": "Propiedades reasignadas exitosamente",
   *   "cantidad": 2,
   *   "detalles": [
   *     { "propiedadId": 1, "asesorId": 4, "success": true },
   *     { "propiedadId": 2, "asesorId": 5, "success": true }
   *   ]
   * }
   *
   * @param data - Objeto con usuarioOrigenId y array de asignaciones [{propiedadId, nuevoAsesorId}]
   */
  reasignarPropiedadesMultiple(data: {
    usuarioOrigenId: number;
    asignaciones: Array<{ propiedadId: number; nuevoAsesorId: number }>;
  }): Observable<{ mensaje: string; cantidad: number; detalles: Array<{ propiedadId: number; asesorId: number; success: boolean }> }> {
    this.loading.set(true);

    // TODO: Descomentar cuando el backend esté listo
    // const url = `${this.apiUrl}/${data.usuarioOrigenId}/propiedades/reasignar`;
    // return this.http.post<any>(url, { asignaciones: data.asignaciones }).pipe(
    //   tap(() => this.loading.set(false)),
    //   catchError(error => {
    //     console.error('Error al reasignar propiedades:', error);
    //     this.loading.set(false);
    //     return throwError(() => error);
    //   })
    // );

    // MOCK: Simular respuesta del backend
    console.warn('[MOCK] reasignarPropiedadesMultiple - Endpoint:', `POST /api/usuarios/${data.usuarioOrigenId}/propiedades/reasignar`);
    console.warn('[MOCK] Request Body:', { asignaciones: data.asignaciones });

    const detalles = data.asignaciones.map(a => ({
      propiedadId: a.propiedadId,
      asesorId: a.nuevoAsesorId,
      success: true
    }));

    return of({
      mensaje: `Se reasignaron ${data.asignaciones.length} propiedades exitosamente`,
      cantidad: data.asignaciones.length,
      detalles
    }).pipe(
      delay(1000),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Obtiene la cantidad de propiedades asignadas a un asesor
   */
  getPropertyCountByAsesor(asesorId: number): Observable<number> {
    return this.propertyService.getPropiedades({ limite: 1000 }).pipe(
      map(response => {
        const propiedadesAsesor = response.datos.filter(p => p.asesorId === asesorId);
        return propiedadesAsesor.length;
      }),
      catchError(err => {
        console.error('Error al obtener propiedades del asesor:', err);
        return of(0);
      })
    );
  }

  /**
   * Reinicia la contraseña de un usuario
   * TODO: En mock solo simula. Conectar con API real.
   */
  reiniciarPassword(id: number): Observable<{ passwordTemporal: string }> {
    this.loading.set(true);

    const passwordTemporal = this.generarPasswordTemporal();
    console.warn('[MOCK] reiniciarPassword - No se persiste:', id, passwordTemporal);

    return of({ passwordTemporal }).pipe(
      delay(500),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Actualiza la contraseña de un usuario
   * TODO: En mock solo simula. Conectar con API real.
   */
  actualizarPassword(id: number, nuevaPassword: string): Observable<void> {
    this.loading.set(true);

    console.warn('[MOCK] actualizarPassword - No se persiste:', id);

    return of(void 0).pipe(
      delay(500),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Activa/Desactiva un usuario
   */
  toggleActivo(id: number): Observable<Usuario> {
    return this.getUsuarioPorId(id).pipe(
      map(usuario => {
        if (!usuario) throw new Error('Usuario no encontrado');
        return { ...usuario, activo: !usuario.activo };
      }),
      tap(usuario => console.warn('[MOCK] toggleActivo - No se persiste:', usuario))
    );
  }

  /**
   * Marca/Desmarca un usuario como destacado
   */
  toggleDestacado(id: number): Observable<Usuario> {
    return this.getUsuarioPorId(id).pipe(
      map(usuario => {
        if (!usuario) throw new Error('Usuario no encontrado');
        return { ...usuario, destacado: !usuario.destacado };
      }),
      tap(usuario => console.warn('[MOCK] toggleDestacado - No se persiste:', usuario))
    );
  }

  // Helpers privados
  private generarPasswordTemporal(): string {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  }

  private crearPerfilAsesorPorDefecto(parcial?: Partial<PerfilAsesor>): PerfilAsesor {
    return {
      cargo: parcial?.cargo || 'Asesor Inmobiliario',
      especialidad: parcial?.especialidad || '',
      slogan: parcial?.slogan || '',
      biografia: parcial?.biografia || '',
      experienciaAnios: parcial?.experienciaAnios || 0,
      idiomas: parcial?.idiomas || ['Español'],
      whatsapp: parcial?.whatsapp || '',
      linkedin: parcial?.linkedin || '',
      instagram: parcial?.instagram || '',
      facebook: parcial?.facebook || '',
      propiedadesVendidas: parcial?.propiedadesVendidas || 0,
      clientesSatisfechos: parcial?.clientesSatisfechos || 0,
      certificaciones: parcial?.certificaciones || [],
      premios: parcial?.premios || []
    };
  }

  // Getters para signals
  isLoading = this.loading.asReadonly();
  getError = this.error.asReadonly();
  getUsuariosCache = this.usuariosCache.asReadonly();
}
