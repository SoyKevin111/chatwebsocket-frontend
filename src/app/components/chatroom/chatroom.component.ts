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
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  username: string = '';
  message: string = '';
  messages: any[] = [];
  isConnected: boolean = false;
  connectingMessage: string = 'Connecting ...';

  private wsService = inject(WebsocketService);
  private userService = inject(UserService);

  ngOnInit(): void {
    console.log('ChatroomComponent ngOnInit called.');

    const usernameFromStorage = localStorage.getItem('username');

    if (usernameFromStorage) {
      this.initializeWebSocket(usernameFromStorage);
    } else {
      console.log('Usuario no cargado.');
    }
  }

  private initializeWebSocket(username: string): void {
    this.wsService.connect(username);

    this.wsService.messages$.subscribe(message => {
      if (message) {
        console.log(
          `Message received from ${message.sender} : ${message.content} : ${message.timestamp}`
        );
        this.messages.push(message);
      }
    });

    this.wsService.connectionStatus$.subscribe(connected => {
      this.isConnected = connected;

      if (connected) {
        this.connectingMessage = '';
        console.log('WS conexión establecida.');
      }
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.wsService.sendMessage(this.username, this.message);
      this.message = '';
    }
  }

  getAvatarColor(sender: string): string {
    const colors = [
      '#2196F3', '#32c787', '#00BCD4', '#ff5652',
      '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];

    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = 31 * hash + sender.charCodeAt(i);
    }

    return colors[Math.abs(hash % colors.length)];
  }
}
