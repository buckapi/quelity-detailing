import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Observable, from, tap, map } from 'rxjs';
import { GlobalService } from './global.service';
interface UserInterface {
  id: string;
  email: string;
  address: string;
  password: string;
  full_name: string;
  images: string[];
  days: string[];
  username:string;
  created: string;
  updated: string;
  avatar: string;
  status: string;
  type: string;
  biography?: string; 

}
@Injectable({
  providedIn: 'root'
})
export class AuthPocketbaseService {
  private pb: PocketBase;
  complete: boolean = false;
  constructor( 
    public global: GlobalService
   ) 
  { 
    this.pb = new PocketBase('https://db.buckapi.com:8095');
  }
 /*  async registerUser(data: any): Promise<any> {
    try {
      const record = await this.pb.collection('users').create(data);
      await this.pb.collection('users').requestVerification(data.email);
      return record;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  } */

  isLogin() {
    return localStorage.getItem('isLoggedin');
  }

  isAdmin() {
    const userType = localStorage.getItem('type');
    return userType === '"admin"';
  }

  isTechnical() {
    const userType = localStorage.getItem('type');
    return userType === '"tecnico"';
  }

  isSupervisor() {
    const userType = localStorage.getItem('type');
    return userType === '"supervisor"';
  }

  isCustomer() {
    const userType = localStorage.getItem('type');
    return userType === '"cliente"';
  }

  registerUser(email: string, password: string, type: string, name: string, address: string // Añadimos el parámetro address
    ): Observable<any> 
    {
    const userData = {
      email: email,
      password: password,
      passwordConfirm: password,
      type: type,
      username: name,
      name: name,
    };

    // Crear usuario y luego crear el registro en clinics
    return from(
      this.pb
        .collection('users')
        .create(userData)
        .then((user) => {
          const data = {
            full_name: name,
            services: [{ "id": "", "name": "", "price": 0 }],
            address: address, // Usamos el parámetro address aquí
            phone: '', // Agrega los campos correspondientes aquí
            userId: user.id, // Utiliza el ID del usuario recién creado
            status: 'pending', // Opcional, establece el estado del cliente
            images: {}, // Agrega los campos correspondientes aquí
          };
          if (type === 'cliente') {
            return this.pb.collection('customer').create(data);
          } else if (type === 'supervisor') {
            return this.pb.collection('supervisor').create(data);
          } else if (type === 'tecnico') {
            return this.pb.collection('technical').create(data);
          } else {
            throw new Error('Tipo de usuario no válido');
          }
        })
    );
    }
  loginUser(email: string, password: string): Observable<any> {
    return from(this.pb.collection('users').authWithPassword(email, password))
      .pipe(
        map((authData) => {
          const pbUser = authData.record;
          const user: UserInterface = {
            id: pbUser.id,
            email: pbUser['email'],
            password: '', // No almacenamos la contraseña por seguridad
            full_name: pbUser['name'],
            days: pbUser['days'] || {},
            images: pbUser['images'] || {},
            type: pbUser['type'],
            username: pbUser['username'],
            address: pbUser['address'],
            created: pbUser['created'],
            updated: pbUser['updated'],
            avatar: pbUser['avatar'] || '',
            status: pbUser['status'] || 'active',
            biography: pbUser['biography'],
            // Añade aquí cualquier otro campo necesario
          };
          return { ...authData, user };
        }),
        tap((authData) => {
          this.setUser(authData.user);
          this.setToken(authData.token);
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('userId', authData.user.id);
        })
      );
  }

  logoutUser(): Observable<any> {
    // Limpiar la autenticación almacenada
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('dist');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
    localStorage.removeItem('clientCard');
    localStorage.removeItem('clientFicha');
    localStorage.removeItem('memberId');
    localStorage.removeItem('status');

    this.pb.authStore.clear();
    this.global.setRoute('login');
    // this.virtualRouter.routerActive = "home";
    return new Observable<any>((observer) => {
      observer.next(); // Indicar que la operación de cierre de sesión ha completado
      observer.complete();
    });
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    let type = JSON.stringify(user.type);
    localStorage.setItem('currentUser', user_string);
    localStorage.setItem('type', type);
  }
  setToken(token: any): void {
    localStorage.setItem('accessToken', token);
  }

  getCurrentUser(): UserInterface {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null; // Devuelve el usuario actual o null si no existe
  }
  getUserId(): string {
    const userId = localStorage.getItem('userId');
    return userId ? userId : ''; // Devuelve el usuario actual o null si no existe
  }
  getFullName(): string {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      return user.full_name || 'Usuario';
    }
    return 'Usuario';
  }
  profileStatus() {
    return this.complete;
  }
  permision() {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.type) {
      console.warn('Usuario o tipo no definido, no se puede mostrar el perfil');
      return;
    }

    // Llamar a la API para obtener información actualizada del usuario
    this.pb.collection('users').getOne(currentUser.id).then(updatedUser => {
      switch (updatedUser["type"]) { 
        case 'cliente':
          this.complete = updatedUser["profilePicture"] && updatedUser["address"];
          break;
        case 'tecnico':
          this.complete = updatedUser["certifications"] && updatedUser["experience"];
          break;
        case 'supervisor':
          this.complete = updatedUser["department"] && updatedUser["teamMembers"];
          break;
        default:
          console.warn('Tipo de usuario no reconocido');
          this.complete = false;
      }
      
      // Mostrar el perfil en base a si está completo o no
      if (this.complete) {
        console.log('Perfil completo, listo para mostrar');
        // Aquí puedes agregar cualquier lógica adicional para mostrar el perfil
      } else {
        console.log('Perfil incompleto, algunos campos faltan');
        // Aquí puedes manejar la lógica si deseas resaltar los campos faltantes
      }
      
    }).catch(error => {
      console.error('Error al obtener la información del usuario:', error);
      this.complete = false;
    });
}

 

}
