import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeWorkInstructionsService implements OnDestroy {
  private pb: PocketBase;
  private workInstructionsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public workInstructions$: Observable<any[]> =
    this.workInstructionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToWorkInstructions();
  }

  private async subscribeToWorkInstructions() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('workInstructions').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateworkInstructionsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);
    // Actualizar la lista de esupervisoras
    this.updateworkInstructionsList();
  }

  private async updateworkInstructionsList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('workInstructions')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    
    // Agregar este log para inspeccionar la estructura
    console.log('Estructura del primer registro:', records[0]['technicialId']);

       // Modificar el log para ver la estructura completa del registro
       console.log('Estructura completa del primer registro:', records[0]);
       console.log('Campos disponibles:', Object.keys(records[0]));
       // Si necesitas acceder al ID técnico específicamente:
       console.log('ID técnico:', records[0]?.['technicalId']);
     
    
    this.workInstructionsSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('workInstructions').unsubscribe('*');
  }

  getWorkInstructionCount(): number {
    return this.workInstructionsSubject.value.length;
  }

  // Agregar este nuevo método para obtener los campos
  public logRecordStructure(): void {
    const currentRecords = this.workInstructionsSubject.value;
    if (currentRecords.length > 0) {
      const firstRecord = currentRecords[0];
      console.log('Campos disponibles:', Object.keys(firstRecord));
      console.log('Registro completo:', firstRecord);
    } else {
      console.log('No hay registros disponibles');
    }
  }
}
