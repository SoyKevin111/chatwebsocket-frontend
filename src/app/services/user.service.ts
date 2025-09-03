import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ///register?username=SoyKevin111
  private API_URL: string = 'http://localhost:8080/users';
  private http: HttpClient = inject(HttpClient)

  constructor() { }

  register(username: string): Observable<any> { //usuario recien creado
    return this.http.post<any>(`${this.API_URL}/register?username=${username}`, null);
  }

}
