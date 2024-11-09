import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  private pb = new PocketBase('https://db.buckapi.com:8095');

  constructor() {}

  async createSupervisor(data: any): Promise<any> {
    try {
      const record = await this.pb.collection('supervisors').create(data);
      return record;
    } catch (error) {
      console.error('Error creating supervisor:', error);
      throw error;
    }
  }
}
