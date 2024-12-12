import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { RealtimeActivitiesService } from '../../services/realtime-activities.service';
import { RealtimeActivitiesWorkInstructionsService } from '../../services/realtime-activitiesWorkInstruction.service';
import PocketBase from 'pocketbase';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefectsModalComponent } from '../defects-modal/defects-modal.component';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

interface Defect {
  type: string;
  quantity: number;
  description: string;
}
interface ActivityForm {
  partNumber: string;
  date: string;
  hu: string;
  serialNumber: string;
  good: number;
  damaged: number;
  dimensions: string;
  total: number;
  comments: string;
  workinstructionId: string;
  technicalId: string;
  supervisorId: string;
  defects: any[];
}
@Component({
  selector: 'app-workinstructiondetail',
  standalone: true,
  imports: [CommonModule, FormsModule,DefectsModalComponent, NgbModule],
  providers: [NgbModal],
  templateUrl: './workinstructiondetail.component.html',
  styleUrls: ['./workinstructiondetail.component.css'] // Corregido styleUrl a styleUrls
})
export class WorkinstructiondetailComponent implements OnInit {
  
  workinstructionId: string = '';
  currentDefects: Defect[] = [];
  technicials: any[] = [];
  selectedtechnicalId: string = '';
  isUpdating: boolean = false;
  selectedSupervisorId: string = '';
  isEditing = false;
  editForm: any = {};
  workInstructionForm!: any;
  isEditingFinance = false;
  editFinanceForm = {
    financeContactPosition: '',
    financeContactNumber: '',
    financeEmail: ''
  };
  selectedDefects: any[] = [];
  private defectsModal: any = null;
  private pb = new PocketBase('https://db.buckapi.com:8095');
  
  // Modelo para el formulario
  activityForm: ActivityForm = {
    partNumber: '',
    date: '',
    hu: '',
    serialNumber: '',
    good: 0,
    damaged: 0,
    dimensions: '',
    total: 0,
    comments: '',
    workinstructionId: '', // Se llenará con el ID actual
    technicalId: '',       // Se llenará con el técnico actual
    supervisorId: '',       // Se llenará con el supervisor actual
    defects: []
  };
  activityFormWorkinstruction = {
    number: '',
    process: '',
    description: '',
    focusPoints: '',
    time: '',
    visualAid: '',
    workinstructionId: '', // Se llenará con el ID actual
    technicalId: '',       // Se llenará con el técnico actual
    supervisorId: '',       // Se llenará con el supervisor actual
    defects: []
  };
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    private workInstructionsPb: WorkInstructionsPbService,
    private router: Router,
    public workInstructionService: WorkInstructionService,
    public realtimeTechnicals: RealtimeTechnicalsService,
    public realtimeActivities: RealtimeActivitiesService,
    public realtimeActivitiesWorkInstructions: RealtimeActivitiesWorkInstructionsService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object
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
/*     this.defectsModal = new bootstrap.Modal(document.getElementById('defectsDetailsModal')); */
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('defectsDetailsModal');
      if (modalElement) {
        this.defectsModal = new bootstrap.Modal(modalElement);
      } else {
        console.warn('Elemento modal no encontrado en el DOM');
      }
    }
  }
  calculateTotal() {
    this.activityForm.total = this.activityForm.good + this.activityForm.damaged;
  }
  async createActivity() {
      try {
          // Preparamos el objeto completo incluyendo los defectos
          const activityData = {
              ...this.activityForm,
              workinstructionId: this.global.workInstructionSelected.id,
              technicalId: this.global.workInstructionSelected.technicalId,
              supervisorId: this.global.workInstructionSelected.supervisorId,
              defects: this.activityForm.defects || [] // Aseguramos que siempre haya un array
          };

          console.log('Datos de actividad a crear:', activityData);

          const record = await this.pb.collection('activities').create(activityData);
          console.log('Actividad creada exitosamente:', record);
          
          this.resetForm();
          Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Actividad creada correctamente'
          });
          
      } catch (error) {
          console.error('Error al crear actividad:', error);
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al crear la actividad'
          });
      }
  }
  resetForm() {
    this.activityForm = {
      partNumber: '',
      date: '',
      hu: '',
      serialNumber: '',
      good: 0,
      damaged: 0,
      dimensions: '',
      total: 0,
      comments: '',
      workinstructionId: this.global.workInstructionSelected.id,
      technicalId: this.global.workInstructionSelected.technicalId,
      supervisorId: this.global.workInstructionSelected.supervisorId,
      defects: []
    };
  }
  openDefectsModal() {
    const modalRef = this.modalService.open(DefectsModalComponent);
    modalRef.componentInstance.currentDefects = this.activityForm.defects || [];

    modalRef.result.then(
        (result) => {
            if (result) {
                // Actualizamos los defectos en el formulario de actividad
                this.activityForm.defects = result;
                console.log('Defectos actualizados en el formulario:', this.activityForm.defects);
            }
        },
        (reason) => {
            console.log('Modal cerrado con error:', reason);
        }
    );
}

  async createActivityWorkinstruction() {
    try {
      this.activityFormWorkinstruction.workinstructionId = this.global.workInstructionSelected.id;
      this.activityFormWorkinstruction.technicalId = this.global.workInstructionSelected.technicalId;
      this.activityFormWorkinstruction.supervisorId = this.global.workInstructionSelected.supervisorId;
      const record = await this.pb.collection('activitiesWorkInstruction').create(this.activityFormWorkinstruction);
      console.log('Activity WorkInstruction:', record);
      
      // Limpiar formulario después de crear
      this.resetFormWorkInstruction();
      
      // Opcional: Mostrar mensaje de éxito
      alert('Successfully created');
      
    } catch (error) {
      console.error('Error al crear actividad:', error);
      alert('Error creating activity');
    }
  }

  resetFormWorkInstruction() {
    this.activityFormWorkinstruction = {
      number: '',
      process: '',
      description: '',
      focusPoints: '',
      time: '',
      visualAid: '',
      workinstructionId: this.global.workInstructionSelected.id,
      technicalId: this.global.workInstructionSelected.technicalId,
      supervisorId: this.global.workInstructionSelected.supervisorId,
      defects: []
    };
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

      console.log('Success:', response);
      Swal.fire({
        icon: 'success',
          title: 'Success',
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

  async updateSupervisors() {
    try {
      // Validaciones específicas
      if (!this.selectedSupervisorId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a supervisor.'
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
        supervisorId: this.selectedSupervisorId
      };

      console.log('Updating work instruction:', updatedWorkInstruction);
      
      const response = await this.workInstructionsPb.updateWorkInstruction(
        this.global.workInstructionSelected.id,
        updatedWorkInstruction
      );

      console.log('Success:', response);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Supervisor assigned correctly.'
      });
      
      this.selectedSupervisorId = '';
      this.global.workInstructionSelected = { ...updatedWorkInstruction };
      
    } catch (error: any) {
      console.error('Error in the update:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem assigning the supervisor. Details: ' + (error.message || error)
      });
    }
  }

  cancelUpdate() {
    this.selectedtechnicalId = '';
      console.log('Update cancelled');
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
  getSupervisorName(supervisorId: string): string {
    let supervisorName = 'No asignado';
    
    this.realtimeSupervisors.supervisors$.subscribe(supervisors => {
      const supervisor = supervisors.find(s => s.id === supervisorId);
      if (supervisor) {
        supervisorName = supervisor.name;
      }
    });
  
    return supervisorName;
  }

  async updateWorkInstruction() {
    try {
      // Validaciones
      if (!this.global.workInstructionSelected?.id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No work instruction selected.'
        });
        return;
      }

      // Crear objeto con los datos actualizados
      const datosActualizados = {
        companyName: this.editForm.companyName,
        contactName: this.editForm.contactName,
        billingAddress: this.editForm.billingAddress,
        cityStateCountryZip: this.editForm.cityStateCountryZip,
        mobile: this.editForm.mobile,
        email: this.editForm.email,
        financeContactPosition: this.editForm.financeContactPosition,
        financeContactNumber: this.editForm.financeContactNumber,
        financeEmail: this.editForm.financeEmail,
        customer: this.editForm.customer,
        numberOfControl: this.editForm.numberOfControl,
        area: this.editForm.area,
        partNumber: this.editForm.partNumber,
        operation: this.editForm.operation,
        mananger: this.editForm.mananger,
        engineer: this.editForm.engineer
      };

      const response = await this.workInstructionService
        .updateWorkInstruction(this.global.workInstructionSelected.id, datosActualizados)
        .toPromise();

      // Actualizar el objeto seleccionado con los nuevos datos
      this.global.workInstructionSelected = { 
        ...this.global.workInstructionSelected, 
        ...datosActualizados 
      };

      // Resetear el modo de edición
      this.isEditing = false;
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Work instruction updated correctly.'
      });

    } catch (error: any) {
      console.error('Error in the update:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem updating the work instruction. Details: ' + (error.message || error)
      });
    }
  }

  // Función auxiliar para iniciar la edición
  startEditing() {
    this.editForm = { ...this.global.workInstructionSelected };
    this.isEditing = true;
  }

  // Función para cancelar la edición
  cancelEditing() {
    this.isEditing = false;
    this.editForm = {};
  }

  toggleEdit() {
    if (this.isEditing) {
      this.cancelEditing();
    } else {
      this.startEditing();
    }
  }
 // Método para formatear la cantidad de defectos
 getTotalDefects(defects: Defect[]): number {
  return defects?.reduce((total, defect) => total + defect.quantity, 0) || 0;
}

// Método para verificar si hay defectos
hasDefects(defects: any[]): boolean {
  return Array.isArray(defects) && defects.length > 0;
}
 
/* openDefectsDetailsModal(defects: any[]) {
  this.selectedDefects = defects;
  this.defectsModal?.show();
} */
  openDefectsDetailsModal(defects: any[]) {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedDefects = defects;
      if (this.defectsModal) {
        this.defectsModal.show();
      } else {
        console.error('Modal no inicializado correctamente');
      }
    }
  }
}
