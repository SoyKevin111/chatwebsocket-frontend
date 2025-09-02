import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  username: string = '';
  message: string = '';
  messages: any[] = [];
  isConnected: boolean = false;

  connectingMessage = 'Connecting ...';

  wsService = inject(WebsocketService);


  ngOnInit(): void {
    console.log('App component ngOnInit called.');

    this.wsService.messages$.subscribe(message => {
      if (message) {
        console.log(`Message received from ${message.sender} : ${message.content}`);
        this.messages.push(message);
      }
    });
    this.wsService.connectionStatus$.subscribe(connected => {
      this.isConnected = connected;

      if (connected) {
        this.connectingMessage = '';
        console.log('wS conexion establecida.');

      }
    })

  }

  connect() {
    console.log('conexion a: localhost/8080/ws');
    this.wsService.connect(this.username);
  }

  sendMessage() {
    if (this.message) {
      this.wsService.sendMessage(this.username, this.message);
      this.message = '';
    }
  }


  getAvatarColor(sender: string): string {
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];

    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = 31 * hash + sender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
  }




}
