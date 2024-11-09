import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import Swal from 'sweetalert2';
import { RealtimeSupervisorsService } from '../../services/realtime-supervisors.service';
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
    {
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
    },
    // Agrega más supervisores según sea necesario
  ];
  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    public auth: AuthPocketbaseService,
    public realtimeSupervisors: RealtimeSupervisorsService

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
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.'
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
          title: 'Supervisor creado',
          text: `Supervisor creado exitosamente. Contraseña generada: ${result.password}`
        });
        this.supervisorForm.reset();
        this.previewImage = 'assets/images/thumbs/setting-profile-img.jpg';
        this.showForm = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el supervisor.'
        });
        console.error('Error al crear el supervisor:', error);
      }
    });
  }
}
