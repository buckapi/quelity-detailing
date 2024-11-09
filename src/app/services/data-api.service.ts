import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { map} from 'rxjs/operators';

export interface RequestInterface{
}
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  private baseUrl = 'https://db.buckapi.com:8095/api';

  constructor(
    private http: HttpClient,
    public global: GlobalService
  ) { }
  headers : HttpHeaders = new HttpHeaders({  		
    "Content-Type":"application/json"	
});

getAllRequests() {
  const url_api = this.global.origin.restUrl + '/api/collections/requestServices/records';
  return this.http.get(url_api);
  }

  saveRequest( request: RequestInterface) {
		const url_api = this.global.origin.restUrl + '/api/collections/requestServices/records';
		return this.http.post<RequestInterface>(url_api, request).pipe(
		  map(data => data)
		);
	  }
}
