import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl: string = environment.apiUrl;
  constructor(private api: ApiService) { }

  getClassrooms(){
      return this.api.get(this.apiUrl+'/getClassroom');
  }

  getTeachers(){
    return this.api.get(this.apiUrl+'/getTeachers');
  }

  getStudents(){
    return this.api.get(this.apiUrl+'/getStudents');
  }

  createClass(body){
    return this.api.post(this.apiUrl+'/createClass' , body);
  }

  getClasses(){
    return this.api.get(this.apiUrl+'/getClass');
  }
  
}
