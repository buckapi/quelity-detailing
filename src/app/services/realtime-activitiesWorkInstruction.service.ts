import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RealtimeActivitiesWorkInstructionsService implements OnDestroy {
  private pb: PocketBase;
  private activitiesWorkInstructionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public activitiesWorkInstructions$: Observable<any[]> =
    this.activitiesWorkInstructionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToActivitiesWorkInstructions();
  }

  private async subscribeToActivitiesWorkInstructions() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('activitiesWorkInstruction').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateActivitiesWorkInstructionsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateActivitiesWorkInstructionsList();
  }

  private async updateActivitiesWorkInstructionsList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('activitiesWorkInstruction')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.activitiesWorkInstructionsSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('activitiesWorkInstruction').unsubscribe('*');
  }

  getActivitiesWorkInstructionsCount(): number {
    return this.activitiesWorkInstructionsSubject.value.length;
  }
}
