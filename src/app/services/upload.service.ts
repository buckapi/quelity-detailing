import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import PocketBase from 'pocketbase';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public pb: PocketBase;

  constructor(
    public global: GlobalService
  ) {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
  }

  uploadToActivityWorkInstruction(file: File, activityData: any): Observable<any> {
    return from(this.createActivityWorkInstructionRecord(file, activityData));
  }

  public async createActivityWorkInstructionRecord(file: File, activityData: any): Promise<any> {
    try {
      const formData = new FormData();
      
      // Agregar el archivo
      formData.append('file', file);
      
      // Agregar los campos del formulario
      formData.append('number', activityData.number || new Date().getTime().toString());
      formData.append('date', activityData.date || new Date().toISOString());
      formData.append('process', activityData.process || 'Image Upload');
      formData.append('description', activityData.description || 'Image uploaded from work instruction');
      formData.append('focusPoints', activityData.focusPoints || '');
      formData.append('workinstructionId', activityData.workinstructionId);
      formData.append('technicalId', activityData.technicalId);
      formData.append('supervisorId', activityData.supervisorId);
      formData.append('time', activityData.time || new Date().toISOString());
      
      // Crear el registro
      const record = await this.pb.collection('activitiesWorkInstruction').create(formData);
      
      return {
        url: this.pb.files.getUrl(record, record['file']),
        id: record.id,
        filename: record['file'],
        success: true,
        record: record
      };
    } catch (error) {
      console.error('Error creating activity record:', error);
      throw error;
    }
  }

  getFileUrl(record: any): string {
    return this.pb.files.getUrl(record, record['file']);
  }
}
