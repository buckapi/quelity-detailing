import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(environment.pocketbaseUrl);
  }

  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const record = await this.pb.collection('files').create(formData);
      return record;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  getFileUrl(recordId: string, fileName: string): string {
    return this.pb.files.getUrl({ collectionId: 'files', recordId, fileName });
  }
}
