import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../../core/services/user.service';
import type { Usuario, RolUsuario } from '../../../../../core/models/user.interface';
import type { FiltrosUsuarios } from '../../../../../core/models/search-filters.interface';
import {
  PageHeaderComponent,
  HeaderAction,
  StatsGridComponent,
  StatCardConfig,
  EmptyStateComponent,
  ConfirmModalComponent,
  ReassignPropertiesDialogComponent,
  type ReasignacionMultipleData
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PageHeaderComponent,
    StatsGridComponent,
    EmptyStateComponent,
    ConfirmModalComponent,
    ReassignPropertiesDialogComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  // Estado
  users = signal<Usuario[]>([]);
  totalUsers = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(true);
  
  // Filtros
  filters = signal<FiltrosUsuarios>({
    pagina: 1,
    limite: 10,
    ordenarPor: 'fechaRegistro',
    ordenDireccion: 'desc'
  });

  // Para el modal de confirmación
  userToDeactivate = signal<Usuario | null>(null);
  isDeactivating = signal(false);
  
  // Para el modal de reactivación
  userToReactivate = signal<Usuario | null>(null);

  // Para el flujo de reasignación de propiedades
  showReassignDialog = signal(false);
  asesorToDeactivate = signal<Usuario | null>(null);
  asesorHasProperties = signal(false);
  propertyCount = signal(0);

  // Configuración del header
  primaryAction: HeaderAction = {
    label: 'Nuevo Usuario',
    icon: 'bi-person-plus',
    route: '/member-area/usuarios/nuevo',
    variant: 'primary'
  };

  // Stats cards - ahora se cargan aparte sin filtros
  statsCards = signal<StatCardConfig[]>([
    { value: 0, label: 'Total Usuarios', icon: 'bi-people', variant: 'primary' },
    { value: 0, label: 'Activos', icon: 'bi-person-check', variant: 'success' },
    { value: 0, label: 'Asesores', icon: 'bi-briefcase', variant: 'info' },
    { value: 0, label: 'Administradores', icon: 'bi-shield-check', variant: 'warning' }
  ]);

  // Nombre del usuario a desactivar para el modal
  userToDeactivateName = computed(() => {
    const user = this.userToDeactivate();
    return user ? this.getFullName(user) : '';
  });

  // Nombre del usuario a reactivar para el modal
  userToReactivateName = computed(() => {
    const user = this.userToReactivate();
    return user ? this.getFullName(user) : '';
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsuarios(this.filters()).subscribe({
      next: (respuesta) => {
        this.users.set(respuesta.datos);
        this.totalUsers.set(respuesta.paginacion.totalItems);
        this.currentPage.set(respuesta.paginacion.paginaActual);
        this.totalPages.set(respuesta.paginacion.totalPaginas);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadStats(): void {
    // Cargar todos los usuarios sin paginar para las estadísticas
    this.userService.getUsuarios({ limite: 1000 }).subscribe({
      next: (respuesta) => {
        const allUsers = respuesta.datos;
        const total = allUsers.length;
        const activos = allUsers.filter(u => u.activo).length;
        const asesores = allUsers.filter(u => u.rol === 'asesor').length;
        const admins = allUsers.filter(u => u.rol === 'admin').length;

        this.statsCards.set([
          { value: total, label: 'Total Usuarios', icon: 'bi-people', variant: 'primary' },
          { value: activos, label: 'Activos', icon: 'bi-person-check', variant: 'success' },
          { value: asesores, label: 'Asesores', icon: 'bi-briefcase', variant: 'info' },
          { value: admins, label: 'Administradores', icon: 'bi-shield-check', variant: 'warning' }
        ]);
      }
    });
  }

  onFilterChange(key: keyof FiltrosUsuarios, value: any): void {
    this.filters.update(f => ({
      ...f,
      [key]: value === '' || value === null ? undefined : value,
      pagina: 1 // Reset a primera página al cambiar filtros
    }));
    this.loadUsers();
  }

  onSearchChange(search: string): void {
    this.onFilterChange('search', search);
  }

  clearFilters(): void {
    this.filters.set({
      pagina: 1,
      limite: 10,
      ordenarPor: 'fechaRegistro',
      ordenDireccion: 'desc'
    });
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.filters.update(f => ({ ...f, pagina: page }));
    this.loadUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get paginasArray(): number[] {
    const total = this.totalPages();
    const actual = this.currentPage();
    const rango = 2;
    const paginas: number[] = [];

    for (let i = Math.max(1, actual - rango); i <= Math.min(total, actual + rango); i++) {
      paginas.push(i);
    }

    return paginas;
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    return !!(f.search || f.rol || f.activo !== undefined);
  }

  // Abrir modal de confirmación de desactivación
  confirmDeactivate(user: Usuario): void {
    // Siempre mostrar primero el modal de confirmación
    this.userToDeactivate.set(user);
  }

  // Verificar si el asesor tiene propiedades (se llama después de confirmar)
  checkAsesorProperties(asesor: Usuario): void {
    this.userService.getPropertyCountByAsesor(asesor.id).subscribe({
      next: (count) => {
        this.propertyCount.set(count);

        if (count > 0) {
          // Tiene propiedades - cerrar modal de confirmación y mostrar diálogo de reasignación
          this.userToDeactivate.set(null);
          this.isDeactivating.set(false);
          this.asesorHasProperties.set(true);
          this.asesorToDeactivate.set(asesor);
          this.showReassignDialog.set(true);
        } else {
          // No tiene propiedades - desactivar directamente
          this.proceedWithDeactivation(asesor);
        }
      },
      error: () => {
        // En caso de error, desactivar directamente
        this.proceedWithDeactivation(asesor);
      }
    });
  }

  // Cancelar reasignación
  cancelReassign(): void {
    this.showReassignDialog.set(false);
    this.asesorToDeactivate.set(null);
    this.asesorHasProperties.set(false);
    this.propertyCount.set(0);
  }

  // Confirmar reasignación y desactivar
  confirmReassign(data: ReasignacionMultipleData): void {
    const asesor = this.asesorToDeactivate();
    if (!asesor) return;

    this.isDeactivating.set(true);

    // Reasignar propiedades (ahora soporta múltiples asesores destino)
    this.userService.reasignarPropiedadesMultiple(data).subscribe({
      next: () => {
        // Luego desactivar el asesor
        this.proceedWithDeactivation(asesor);
      },
      error: (err: unknown) => {
        console.error('❌ Error al reasignar propiedades:', err);
        this.isDeactivating.set(false);
      }
    });
  }

  // Proceder con la desactivación
  proceedWithDeactivation(user: Usuario): void {
    this.userService.desactivarUsuario(user.id).subscribe({
      next: () => {
        const updatedUsers = this.users().map(u =>
          u.id === user.id ? { ...u, activo: false } : u
        );
        this.users.set(updatedUsers);
        this.loadStats(); // Actualizar estadísticas

        // Cerrar todos los modales y limpiar estado
        this.userToDeactivate.set(null);
        this.showReassignDialog.set(false);
        this.asesorToDeactivate.set(null);
        this.asesorHasProperties.set(false);
        this.propertyCount.set(0);
        this.isDeactivating.set(false);
      },
      error: (err) => {
        console.error('Error al desactivar usuario:', err);
        this.isDeactivating.set(false);
      }
    });
  }

  // Cancelar desactivación
  cancelDeactivate(): void {
    this.userToDeactivate.set(null);
  }

  // Desactivar usuario (llamado cuando el usuario confirma en el modal)
  deactivateUser(): void {
    const user = this.userToDeactivate();
    if (!user) return;

    this.isDeactivating.set(true);

    // Si es asesor, verificar si tiene propiedades primero
    if (user.rol === 'asesor') {
      this.checkAsesorProperties(user);
      return;
    }

    // Si no es asesor, desactivar directamente
    this.proceedWithDeactivation(user);
  }

  // Reactivar usuario
  reactivateUser(user: Usuario): void {
    this.userToReactivate.set(user);
  }

  confirmReactivate(): void {
    const user = this.userToReactivate();
    if (!user) return;

    this.userService.reactivarUsuario(user.id).subscribe({
      next: () => {
        const updatedUsers = this.users().map(u => 
          u.id === user.id ? { ...u, activo: true } : u
        );
        this.users.set(updatedUsers);
        this.userToReactivate.set(null);
      },
      error: (err) => {
        console.error('Error al reactivar usuario:', err);
      }
    });
  }

  cancelReactivate(): void {
    this.userToReactivate.set(null);
  }

  // Helpers
  getFullName(user: Usuario): string {
    return `${user.nombre} ${user.apellido}`;
  }

  getRolLabel(rol: RolUsuario): string {
    return rol === 'admin' ? 'Administrador' : 'Asesor';
  }

  getRolBadgeClass(rol: RolUsuario): string {
    return rol === 'admin' ? 'badge-warning' : 'badge-info';
  }

  getStatusBadgeClass(activo: boolean): string {
    return activo ? 'badge-success' : 'badge-danger';
  }

  getStatusLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }
}
