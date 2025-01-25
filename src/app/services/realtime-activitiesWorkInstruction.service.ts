import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeActivitiesWorkInstructionsService implements OnDestroy {
  private pb: PocketBase;
  private activitiesWorkInstructionsSubject = new BehaviorSubject<any[]>([]);

  public activitiesWorkInstructions$: Observable<any[]> =
    this.activitiesWorkInstructionsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
    this.subscribeToActivitiesWorkInstructions();
  }

  async createRecord(data: any): Promise<any> {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos de texto
      Object.keys(data).forEach(key => {
        if (key !== 'file') {
          formData.append(key, data[key]);
        }
      });
      
      // Agregar el archivo si existe
      if (data.file && data.file.length > 0) {
        formData.append('image', data.file[0]);
      }
      
      // Crear el registro con la imagen incluida
      const record = await this.pb.collection('activitiesWorkInstruction').create(formData);
      await this.updateActivitiesWorkInstructionsList();
      return record;
    } catch (error) {
      console.error('Error creating activity work instruction:', error);
      throw error;
    }
  }

  private async subscribeToActivitiesWorkInstructions() {
    try {
      this.pb.collection('activitiesWorkInstruction').subscribe('*', (e) => {
        this.handleRealtimeEvent(e);
      });
      await this.updateActivitiesWorkInstructionsList();
    } catch (error) {
      console.error('Error subscribing to activities:', error);
    }
  }

  private handleRealtimeEvent(event: any) {
    console.log(event.action);
    console.log(event.record);
    this.updateActivitiesWorkInstructionsList();
  }

  private async updateActivitiesWorkInstructionsList() {
    try {
      const records = await this.pb
        .collection('activitiesWorkInstruction')
        .getFullList(200, {
          sort: '-created',
          expand: 'files'
        });
      this.activitiesWorkInstructionsSubject.next(records);
    } catch (error) {
      console.error('Error updating activities list:', error);
    }
  }

  ngOnDestroy() {
    this.pb.collection('activitiesWorkInstruction').unsubscribe('*');
  }

  getActivitiesWorkInstructionsCount(): number {
    return this.activitiesWorkInstructionsSubject.value.length;
  }

  // Método público para actualizar la lista
  async refreshList(): Promise<void> {
    await this.updateActivitiesWorkInstructionsList();
  }
}
