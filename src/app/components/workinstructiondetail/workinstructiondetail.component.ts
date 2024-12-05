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
import { RealtimeActivitiesService } from '../../services/realtime-activities.service';
import { RealtimeActivitiesWorkInstructionsService } from '../../services/realtime-activitiesWorkInstruction.service';
import PocketBase from 'pocketbase';

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
  private pb = new PocketBase('https://db.buckapi.com:8095');
  
  // Modelo para el formulario
  activityForm = {
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
    supervisorId: ''       // Se llenará con el supervisor actual
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
    supervisorId: ''       // Se llenará con el supervisor actual
  };
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    private workInstructionsPb: WorkInstructionsPbService,
    private router: Router,
    private workInstructionService: WorkInstructionService,
    public realtimeTechnicals: RealtimeTechnicalsService,
    public realtimeActivities: RealtimeActivitiesService,
    public realtimeActivitiesWorkInstructions: RealtimeActivitiesWorkInstructionsService
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
  calculateTotal() {
    this.activityForm.total = this.activityForm.good + this.activityForm.damaged;
  }
  async createActivity() {
    try {
      this.activityForm.workinstructionId = this.global.workInstructionSelected.id;
      this.activityForm.technicalId = this.global.workInstructionSelected.technicalId;
      this.activityForm.supervisorId = this.global.workInstructionSelected.supervisorId;
      const record = await this.pb.collection('activities').create(this.activityForm);
      console.log('Success:', record);
      
      // Limpiar formulario después de crear
      this.resetForm();
      
      // Opcional: Mostrar mensaje de éxito
      alert('Successfully created');
      
    } catch (error) {
      console.error('Error al crear actividad:', error);
      alert('Error creating activity');
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
      supervisorId: this.global.workInstructionSelected.supervisorId
    };
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
      supervisorId: this.global.workInstructionSelected.supervisorId
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
}
