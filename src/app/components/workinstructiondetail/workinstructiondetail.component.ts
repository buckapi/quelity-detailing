import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataApiService } from '../../services/data-api.service';
import { RealtimeWorkInstructionsService } from '../../services/realtime-work-instructions.service';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeSupervisorsService } from '../../services/realtime-supervisors.service';
import { Router } from '@angular/router';
import { WorkInstructionService } from '../../services/work-instruction.service';
import { RealtimeTechnicalsService } from '../../services/realtime-technicals.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { WorkInstructionsPbService } from '../../services/work-instructions-pb.service';

@Component({
  selector: 'app-workinstructiondetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workinstructiondetail.component.html',
  styleUrls: ['./workinstructiondetail.component.css'] // Corregido styleUrl a styleUrls
})
export class WorkinstructiondetailComponent implements OnInit {
  technicials: any[] = [];
  selectedtechnicalId: string = '';
  isUpdating: boolean = false;

  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    private workInstructionsPb: WorkInstructionsPbService,
    private router: Router,
    private workInstructionService: WorkInstructionService,
    public realtimeTechnicals: RealtimeTechnicalsService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('Instrucción de trabajo seleccionada:', this.global.workInstructionSelected);

    // Cargar técnicos desde el servicio en tiempo real
    this.realtimeTechnicals.technicals$.subscribe({
      next: (technicals) => {
        console.log('Técnicos actualizados:', technicals);
        this.technicials = technicals;
      },
      error: (error) => {
        console.error('Error al obtener técnicos:', error);
      }
    });

    // Cargar técnicos iniciales desde el estado global
    this.loadTechnicials();
  }

  loadTechnicials() {
    if (this.global.getTechnicials) {
      this.technicials = this.global.getTechnicials();
    } else {
      console.warn('Método getTechnicials no definido en el servicio global');
    }
  }

  async updateTechnicals() {
    try {
      // Validaciones específicas
      if (!this.selectedtechnicalId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a technician.'
        });
        return;
      }

      if (!this.global.workInstructionSelected?.id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No work instruction selected.'
        });
        return;
      }

      // Crear objeto de instrucción actualizado
      const updatedWorkInstruction = {
        ...this.global.workInstructionSelected,
        technicalId: this.selectedtechnicalId
      };

      console.log('Updating work instructions:', updatedWorkInstruction);
      
      const response = await this.workInstructionsPb.updateWorkInstruction(
        this.global.workInstructionSelected.id,
        updatedWorkInstruction
      );

      console.log('Actualización exitosa:', response);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Technician successfully assigned.'
      });
      
      this.selectedtechnicalId = '';
      this.global.workInstructionSelected = { ...updatedWorkInstruction };
      
    } catch (error: any) {
      console.error('Error in the update:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem assigning the technician. Details: ' + (error.message || error)
      });
    }
  }

  cancelUpdate() {
    this.selectedtechnicalId = '';
    console.log('Actualización cancelada');
  }

  getTechnicalName(technicalId: string): string {
    let technicalName = 'No asignado';
    
    this.realtimeTechnicals.technicals$.subscribe(technicals => {
      const technical = technicals.find(t => t.id === technicalId);
      if (technical) {
        technicalName = technical.name;
      }
    });

    return technicalName;
  }
}
