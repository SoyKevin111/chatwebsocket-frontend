import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private API_URL: string = 'http://localhost:8080/messages';
  private http: HttpClient = inject(HttpClient)

  constructor() { }
}
