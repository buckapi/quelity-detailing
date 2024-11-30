import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  option: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  address: string = '';
  company: string = '';
  username: string = '';
constructor(
  public global: GlobalService,
  public auth: AuthPocketbaseService
){}
registerUser() {
  this.auth.registerUser(this.email, this.password, 'cliente', this.name, this.username, this.company).subscribe(
    (response) => {
      console.log('User registered successfully', response);
      this.loginAfterRegistration(this.email, this.password);
    },
    (error) => {
      console.error('Error registering user', error);
    }
  );
}
registerCustomer() {
  if (this.name && this.email && this.password && this.name && this.company ) {
    this.auth.registerUser(this.email, this.password, 'cliente', this.name, this.username, this.company).subscribe(
      (response) => {
        console.log('Customer successfully registered ', response);
        Swal.fire({
          title: 'Success',
          text: 'The user has been registered successfully.',
          icon: 'success',
          confirmButtonText: 'Accept'
        }).then(() => {
          this.global.setRoute('home'); // Redirigir al home después de cerrar el alert
        });
      },
      (error) => {
        console.error('Error registering user', error);
      }
    );
  } else {
    console.error('Please complete all required fields');
  }
}
 // Método para iniciar sesión después del registro
 loginAfterRegistration(email: string, password: string) {
  this.auth.loginUser(email, password).subscribe(
    (response) => {
      console.log('Login successful', response);
      this.global.setRoute('home'); // O la ruta que desees después del inicio de sesión
    },
    (error) => {
      console.error('Error logging in after registration', error);
      this.global.setRoute('login'); // Redirigir al login en caso de error
    }
  );
}
}
