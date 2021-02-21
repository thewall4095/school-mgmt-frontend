import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      Accept: "*/*",
    }),
  };
  constructor(private http: HttpClient) { }

  get(endpoint, params?) {
    return this.http.get(endpoint, params);
  }

  post(endpoint, body, params?) {
    return this.http.post(endpoint, body, this.httpOptions);
  }
}
