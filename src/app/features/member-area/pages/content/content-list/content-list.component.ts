import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentAdminService, ContentType, ContentStats } from '../../../services/content-admin.service';
import type { Testimonio, Beneficio, FAQ, Banner } from '../../../../../core/models';
import {
  PageHeaderComponent,
  HeaderAction,
  EmptyStateComponent,
  ConfirmModalComponent
} from '../../../../../shared/components/admin';

type TabType = 'testimonios' | 'beneficios' | 'faqs' | 'banners';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmModalComponent
  ],
  templateUrl: './content-list.component.html',
  styleUrl: './content-list.component.scss'
})
export class ContentListComponent implements OnInit {
  private contentService = inject(ContentAdminService);

  // Estado
  loading = signal(true);
  activeTab = signal<TabType>('testimonios');
  searchTerm = signal('');
  filterActivo = signal<boolean | undefined>(undefined);

  // Datos
  testimonios = signal<Testimonio[]>([]);
  beneficios = signal<Beneficio[]>([]);
  faqs = signal<FAQ[]>([]);
  banners = signal<Banner[]>([]);
  stats = signal<ContentStats | null>(null);

  // Modal de confirmación
  showDeleteModal = signal(false);
  itemToDelete = signal<{ type: ContentType; id: number; nombre: string } | null>(null);
  deleting = signal(false);

  // Tabs
  tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'testimonios', label: 'Testimonios', icon: 'bi-chat-quote' },
    { key: 'beneficios', label: 'Beneficios', icon: 'bi-star' },
    { key: 'faqs', label: 'FAQs', icon: 'bi-question-circle' },
    { key: 'banners', label: 'Banners', icon: 'bi-image' }
  ];

  // Computed
  currentCount = computed(() => {
    const countMap: Record<TabType, number> = {
      testimonios: this.testimonios().length,
      beneficios: this.beneficios().length,
      faqs: this.faqs().length,
      banners: this.banners().length
    };
    return countMap[this.activeTab()];
  });

  // Header action dinámico
  primaryAction = computed<HeaderAction>(() => ({
    label: `Nuevo ${this.activeTab() === 'faqs' ? 'FAQ' : this.getTabSingularName(this.activeTab())}`,
    icon: 'bi-plus-lg',
    route: this.getNewRoute(),
    variant: 'primary'
  }));

  // Nombre del item a eliminar para el modal
  itemToDeleteName = computed(() => this.itemToDelete()?.nombre || '');

  getTabSingularName(tab: TabType): string {
    const names: Record<TabType, string> = {
      'testimonios': 'Testimonio',
      'beneficios': 'Beneficio',
      'faqs': 'FAQ',
      'banners': 'Banner'
    };
    return names[tab];
  }

  ngOnInit() {
    this.loadStats();
    this.loadContent();
  }

  loadStats() {
    this.contentService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadContent() {
    this.loading.set(true);
    const filters = {
      busqueda: this.searchTerm() || undefined,
      activo: this.filterActivo()
    };

    const loaders: Record<TabType, () => void> = {
      testimonios: () => this.contentService.getTestimonios(filters).subscribe({
        next: (data) => { this.testimonios.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      }),
      beneficios: () => this.contentService.getBeneficios(filters).subscribe({
        next: (data) => { this.beneficios.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      }),
      faqs: () => this.contentService.getFaqs(filters).subscribe({
        next: (data) => { this.faqs.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      }),
      banners: () => this.contentService.getBanners(filters).subscribe({
        next: (data) => { this.banners.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      })
    };

    loaders[this.activeTab()]();
  }

  setActiveTab(tab: TabType) {
    this.activeTab.set(tab);
    this.searchTerm.set('');
    this.filterActivo.set(undefined);
    this.loadContent();
  }

  onSearch() {
    this.loadContent();
  }

  onFilterChange() {
    this.loadContent();
  }

  onFilterActivoChange(value: string) {
    this.filterActivo.set(value === 'all' ? undefined : value === 'true');
    this.loadContent();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.filterActivo.set(undefined);
    this.loadContent();
  }

  toggleActivo(type: ContentType, id: number) {
    this.contentService.toggleActivo(type, id).subscribe({
      next: () => {
        this.loadContent();
        this.loadStats();
      },
      error: (err) => console.error('Error toggling activo:', err)
    });
  }

  confirmDelete(type: ContentType, id: number, nombre: string) {
    this.itemToDelete.set({ type, id, nombre });
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.itemToDelete.set(null);
  }

  executeDelete() {
    const item = this.itemToDelete();
    if (!item) return;

    this.deleting.set(true);

    const deleteActions: Record<ContentType, (id: number) => ReturnType<typeof this.contentService.deleteTestimonio>> = {
      testimonios: (id) => this.contentService.deleteTestimonio(id),
      beneficios: (id) => this.contentService.deleteBeneficio(id),
      faqs: (id) => this.contentService.deleteFaq(id),
      banners: (id) => this.contentService.deleteBanner(id)
    };

    deleteActions[item.type](item.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.showDeleteModal.set(false);
        this.itemToDelete.set(null);
        this.loadContent();
        this.loadStats();
      },
      error: () => {
        this.deleting.set(false);
      }
    });
  }

  getNewRoute(): string {
    return `/member-area/contenido/${this.activeTab()}/nuevo`;
  }

  getEditRoute(id: number): string {
    return `/member-area/contenido/${this.activeTab()}/editar/${id}`;
  }

  getStatForTab(tab: TabType): { total: number; activos: number } | null {
    if (!this.stats()) return null;
    return this.stats()![tab];
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getRatingStars(rating: number = 5): number[] {
    return Array(rating).fill(0);
  }
}
