import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import Swal from 'sweetalert2';
import { RealtimeSupervisorsService } from '../../services/realtime-supervisors.service';
import { SupervisorService } from '../../services/supervisor.service';
interface Supervisor {
  name: string;
  role: string;
  description: string;
  tasks: number;
  rating: number;
  reviews: number;
}
@Component({
  selector: 'app-supervisors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supervisors.component.html',
  styleUrls: ['./supervisors.component.css']
})
export class SupervisorsComponent {
  showForm: boolean = false;
  supervisorForm: FormGroup;
  previewImage: string = 'assets/images/thumbs/setting-profile-img.jpg';
  supervisors: Supervisor[] = [
    /* {
      name: 'Maria Prova',
      role: 'Content Writer',
      description: 'Experienced content writer with a focus on UX writing.',
      tasks: 45,
      rating: 4.8,
      reviews: 750
    },
    {
      name: 'Alex John',
      role: 'Web Developer',
      description: 'Specialized in front-end development with Angular and React.',
      tasks: 30,
      rating: 4.7,
      reviews: 500
    }, */
    // Agrega más supervisores según sea necesario
  ];
  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    public auth: AuthPocketbaseService,
    public realtimeSupervisors: RealtimeSupervisorsService,
    public supervisorService: SupervisorService

  ) { 
    this.realtimeSupervisors.supervisors$;

    // Configurar el formulario con validadores
    this.supervisorForm = this.fb.group({
      fname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      image: [null]
    });
  }

  // Alternar la visibilidad del formulario
  showNewSupervisor() {
    this.showForm = !this.showForm;
  }

  // Manejar la selección de archivo e imagen de vista previa
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.supervisorForm.patchValue({ image: file });
      this.previewImage = URL.createObjectURL(file);
    }
  }

  // Enviar el formulario para agregar un nuevo supervisor
  addNewSupervisor() {
    if (this.supervisorForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid form',
        text: 'Please complete all fields correctly.'
      });
      return;
    }

    const { fname, email, phone } = this.supervisorForm.value;
    const address = ''; // Añade la dirección si es necesario

    // Llamar al servicio para crear el supervisor
    this.auth.addSupervisor(email, fname, address, phone).subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Supervisor created',
          text: `Supervisor created successfully. Generated password: ${result.password}`
        });
        this.supervisorForm.reset();
        this.previewImage = 'assets/images/thumbs/setting-profile-img.jpg';
        this.showForm = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the supervisor.'
        });
        console.error('Error creating supervisor:', error);
      }
    });
  }
 /*  async deleteSupervisor(id: string) {
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await this.auth.deleteSupervisor(id);
            Swal.fire(
                '¡Deleted!',
                'The supervisor has been deleted.',
                'success'
            );
        }
    } catch (error) {
        console.error('Error deleting supervisor:', error);
        Swal.fire(
            'Error',
            'Could not delete supervisor',
            'error'
        );
    }
}  */
}
