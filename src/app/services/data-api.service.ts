import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { WorkInstructionService } from './work-instruction.service';

export interface workInstructionsInterface{
}
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  private baseUrl = 'https://db.buckapi.com:8095/api';

  constructor(
    private http: HttpClient,           
    public global: GlobalService,
    private fb: FormBuilder
  ) { }
  headers : HttpHeaders = new HttpHeaders({  		
    "Content-Type":"application/json"	
});

  getAllWorkInstructions(): Observable<WorkInstructionService []> {
    return this.http.get<WorkInstructionService[]>(`${this.baseUrl}/collections/workInstructions/records`);
  }
  saveworkInstructions(request: workInstructionsInterface) {
    const url_api = this.baseUrl + '/collections/workInstructions/records';
		return this.http.post<workInstructionsInterface>(url_api, request).pipe(
		  map(data => data)
		);
	  }
  updateWorkInstruction(updatedWorkInstruction: any) {
    if (!updatedWorkInstruction.id) {
      throw new Error('ID es requerido para actualizar la instrucción de trabajo');
    }
    // /api/collections/workInstructions/records/:id
    const url_api = `${this.baseUrl}/collections/workInstructions/records/${updatedWorkInstruction.id}`;
    
    console.log('URL de actualización:', url_api);
    console.log('Datos a enviar:', updatedWorkInstruction);

    return this.http.put<any>(url_api, updatedWorkInstruction, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error('Error en la actualización:', error);
          if (error.status === 404) {
            throw new Error(`No se encontró la instrucción de trabajo con ID: ${updatedWorkInstruction.id}`);
          }
          throw error;
        })
      );
  }
}
