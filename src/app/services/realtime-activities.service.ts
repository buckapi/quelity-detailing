import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RealtimeActivitiesService implements OnDestroy {
  private pb: PocketBase;
  private activitiesSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public activities$: Observable<any[]> =
    this.activitiesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToActivities();
  }

  private async subscribeToActivities() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('activities').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateActivitiesList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateActivitiesList();
  }

  private async updateActivitiesList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('activities')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.activitiesSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('activities').unsubscribe('*');
  }

  getActivitiesCount(): number {
    return this.activitiesSubject.value.length;
  }
}
