import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private API_URL: string = 'http://localhost:8080/messages';
  private http: HttpClient = inject(HttpClient)

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }
}
