import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeCustomersService implements OnDestroy {
  private pb: PocketBase;
  private customersSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public customers$: Observable<any[]> =
    this.customersSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToCustomers();
  }

  private async subscribeToCustomers() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    this.pb.collection('customers').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esustomeras
    this.updateCustomersList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esustomeras
    this.updateCustomersList();
  }

  private async updateCustomersList() {
    // Obtener la lista actualizada de esustomeras
    const records = await this.pb
      .collection('customers')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.customersSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('customers').unsubscribe('*');
  }

  getCustomerCount(): number {
    return this.customersSubject.value.length;
  }
}
