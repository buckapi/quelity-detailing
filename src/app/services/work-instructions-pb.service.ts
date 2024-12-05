import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

export interface WorkInstructionInterface {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  // ... otras propiedades según necesites
}

@Injectable({
  providedIn: 'root'
})
export class WorkInstructionsPbService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8095');
  }

  async getAllWorkInstructions() {
    try {
      const records = await this.pb.collection('workInstructions').getList();
      return records;
    } catch (error) {
      console.error('Error al obtener instrucciones:', error);
      throw error;
    }
  }

  async saveWorkInstruction(data: WorkInstructionInterface) {
    try {
      const record = await this.pb.collection('workInstructions').create(data);
      return record;
    } catch (error) {
      console.error('Error al guardar instrucción:', error);
      throw error;
    }
  }

  async updateWorkInstruction(id: string, data: WorkInstructionInterface) {
    try {
      const record = await this.pb.collection('workInstructions').update(id, data);
      return record;
    } catch (error) {
      console.error('Error al actualizar instrucción:', error);
      throw error;
    }
  }

  async deleteWorkInstruction(id: string) {
    try {
      await this.pb.collection('workInstructions').delete(id);
      return true;
    } catch (error) {
      console.error('Error al eliminar instrucción:', error);
      throw error;
    }
  }
} 