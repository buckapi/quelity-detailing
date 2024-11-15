import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { map} from 'rxjs/operators';
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
}
