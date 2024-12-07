import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataApiService, workInstructionsInterface } from '../../services/data-api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SupervisorService } from '../../services/supervisor.service';
import { RealtimeSupervisorsService } from '../../services/realtime-supervisors.service';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeWorkInstructionsService } from '../../services/realtime-work-instructions.service';
import { WorkInstructionService } from '../../services/work-instruction.service';

@Component({
  selector: 'app-work-instructions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './work-instructions.component.html',
  styleUrl: './work-instructions.component.css',
})
export class WorkInstructionsComponent implements OnInit {
  workInstructionsForm: FormGroup;
  supervisors: any[] = [];
  
  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    private dataApiService: DataApiService,
    private supervisorService: SupervisorService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    public realtimeWorkInstructions: RealtimeWorkInstructionsService,
    public http: HttpClient,
    public auth: AuthPocketbaseService
  ){ 
    this.workInstructionsForm = this.fb.group({
      companyName: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      billingAddress: ['', [Validators.required]],
      cityStateCountryZip: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      financeContactPosition: ['', [Validators.required]],
      financeContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      financeEmail: ['', [Validators.required, Validators.email]],
      supervisorId: ['', Validators.required],  
      // technicianId: ['', Validators.required],
      customer: ['', [Validators.required]],
      numberOfControl: ['', [Validators.required]],
      area: ['', [Validators.required]],
      partNumber: ['', [Validators.required]],
      operation: ['', [Validators.required]],
      
    });}

  ngOnInit() {
       this.realtimeSupervisors.supervisors$;

    this.loadSupervisors();
    this.initForm();
    this.setClientId();
  }
  private initForm() {
    this.workInstructionsForm = this.fb.group({
      customerId: [''], // Nuevo campo para el ID del cliente
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      billingAddress: ['', Validators.required],
      cityStateCountryZip: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      customer: ['', [Validators.required]],
      financeContactPosition: ['', [Validators.required]],
      financeContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      financeEmail: ['', [Validators.required, Validators.email]]
    });
  }
  private setClientId() {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.workInstructionsForm.patchValue({
        customerId: currentUser.id        
      });
    }
  }
  loadSupervisors() {
    this.realtimeSupervisors.supervisors$.subscribe(
      (data: any) => {
        this.supervisors = data;
    },
      (error: any) => {
        console.error('Error loading supervisors:', error);
      }
    );
  }

 
    addClient(email: string, name: string, address: string, phone: string, company: string, password: string ) {
      // Cambiar para retornar el Observable
      return this.auth.registerUser(email, password, 'cliente', name, '', company);
    }

    // ... existing code ...

  onSubmit() {
    if (this.workInstructionsForm.valid && this.validateForm()) {
      const formData = this.workInstructionsForm.value;
      const password = Math.random().toString(36).slice(-8);
      
      this.auth.registerUser(
        formData.email,
        password,
        'cliente',
        formData.contactName,
        '',
        formData.companyName
      ).subscribe({
        next: (userResult) => {
          // Primero mostrar mensaje de usuario creado
          Swal.fire({
            icon: 'success',
            title: 'Usuario Creado',
            html: `
              <p>The user has been created successfully.</p>
              <p><strong>Access credentials:</strong></p>
              <p>Email: ${formData.email}</p>
              <p>Password: ${password}</p>
              <p>Please save these credentials in a secure place.</p>
            `,
            confirmButtonText: 'Continuar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Proceder a crear la work instruction
              const workInstructionsData = {
                ...formData,
                clientId: userResult.id
              };

              this.dataApiService.saveworkInstructions(workInstructionsData).subscribe({
                next: (workInstructionsResult) => {
                  console.log('Work Instructions guardadas:', workInstructionsResult);
                  
                  Swal.fire({
                    icon: 'success',
                    title: 'Process Completed',
                    html: `
                      <p>¡The process has been completed successfully!</p>
                      <p>✓ User created</p>
                      <p>✓ Work instructions registered</p>
                    `,
                    confirmButtonText: 'Accept'
                  }).then(() => {
                    this.global.setRoute('home');
                    this.workInstructionsForm.reset();
                  });
                },
                error: (error) => {
                    console.error('Error saving work instructions:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error in Work Instructions',
                    text: 'There was a problem creating the work instructions. The user was created but you should try to create the work instructions again.',
                    confirmButtonText: 'Accept'
                  });
                }
              });
            }
          });
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error creating user',
            text: 'There was a problem creating the user. Please try again.',
            confirmButtonText: 'Accept'
          });
        }
      });
    }
  }



  onSubmitFromClient() {
      if (this.workInstructionsForm.valid) {
        // Obtener el usuario actual y su ID
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No information was found about the user.',
            confirmButtonText: 'Accept'
          });
          return;
        }
    
        // Crear el objeto request con el clientId
        const request: workInstructionsInterface = {
          ...this.workInstructionsForm.value,
          clientId: currentUser.id
        };
    
        this.dataApiService.saveworkInstructions(request).subscribe(
          response => {
            console.log('Datos guardados exitosamente:', response);
            this.global.setRoute('home');
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'The work instructions have been created successfully.',
              confirmButtonText: 'Accept'
            });
    
            this.workInstructionsForm.reset();
          },
          error => {
            console.error('Error al guardar los datos:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was a problem creating the work instructions. Please try again.',
              confirmButtonText: 'Accept'
            });
          }
        );
      }
    }
    

  validateForm(): boolean {
    if (this.workInstructionsForm.invalid) {
      const invalidFields: string[] = [];
      
      Object.keys(this.workInstructionsForm.controls).forEach(key => {
        const control = this.workInstructionsForm.get(key);
        if (control?.invalid) {
          invalidFields.push(this.getFieldLabel(key));
        }
      });

      Swal.fire({
        title: 'Invalid Form',
        html: `Please complete the following fields correctly:<br><br>${invalidFields.join('<br>')}`,
        icon: 'error',
        confirmButtonText: 'Accept'
      });
      
      return false;
    }
    return true;
  }

  private getFieldLabel(fieldName: string): string {
    const fieldLabels: { [key: string]: string } = {
      companyName: 'Nombre de la compañía',
      contactName: 'Nombre de contacto',
      customer: 'Cliente',
      billingAddress: 'Dirección de facturación',
      cityStateCountryZip: 'Ciudad, Estado, País, Código postal',
      mobile: 'Móvil',
      email: 'Correo electrónico',
      numberOfControl: 'Número de control',
      area: 'Área',
      partNumber: 'Número de parte',
      operation: 'Operación',
      supervisorId: 'Supervisor',
      financeContactPosition: 'Posición del contacto financiero',
      financeContactNumber: 'Número de contacto financiero',
      financeEmail: 'Correo electrónico financiero'
    };
    
    return fieldLabels[fieldName] || fieldName;
  }
}
