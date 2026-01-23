import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgentService } from '../../../../core/services/agent.service';
import { AgentCardSkeletonComponent } from '../../components/agent-card-skeleton/agent-card-skeleton.component';
import type { Agente } from '../../../../core/models';

@Component({
  selector: 'app-agent-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, AgentCardSkeletonComponent],
  templateUrl: './agent-listing.component.html',
  styleUrl: './agent-listing.component.scss'
})
export class AgentListingComponent implements OnInit {
  agentes: Agente[] = [];
  isLoading = true;
  skeletonItems = Array(6).fill(0); // 6 skeleton cards

  private readonly agentService = inject(AgentService);

  constructor() { }

  ngOnInit(): void {
    this.loadAgentes();
  }

  private loadAgentes(): void {
    this.isLoading = true;
    
    this.agentService.getAgentes().subscribe({
      next: (agentes) => {
        this.agentes = agentes.filter(a => a.activo);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando agentes:', error);
        this.isLoading = false;
      }
    });
  }

  getNombreCompleto(agente: Agente): string {
    return `${agente.nombre} ${agente.apellido}`;
  }

  formatearTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '');
  }
}
