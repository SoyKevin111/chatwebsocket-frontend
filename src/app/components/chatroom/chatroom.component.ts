import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent implements OnInit {


  username: string = '';
  message: string = '';
  messages: any[] = [];
  isConnected: boolean = false;

  connectingMessage = 'Connecting ...';

  wsService = inject(WebsocketService);
  userService = inject(UserService);


  ngOnInit(): void {
    console.log('App component ngOnInit called.');

    this.wsService.messages$.subscribe(messages => {
      if (messages) {
        console.log(`Message received from ${messages.sender} : ${messages.content} : ${messages.timestamp}`);
        this.messages.push(messages);
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
    this.userService.register(this.username).subscribe({
      next: (user) => {
        console.log('Usuario creado:', user);
        this.wsService.connect(user.username);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      },
      complete: () => {
        console.log('Registro finalizado');
      }
    });
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
