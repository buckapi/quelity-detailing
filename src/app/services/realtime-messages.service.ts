import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeMessagesService implements OnDestroy {
  private pb: PocketBase;
  private messagesSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public messages$: Observable<any[]> =
    this.messagesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToCessages();
  }

  private async subscribeToCessages() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    this.pb.collection('messages').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esessageas
    this.updateMessagesList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esessageas
    this.updateMessagesList();
  }

  private async updateMessagesList() {
    // Obtener la lista actualizada de esessageas
    const records = await this.pb
      .collection('messages')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.messagesSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('messages').unsubscribe('*');
  }

  getMessageCount(): number {
    return this.messagesSubject.value.length;
  }
}
