import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  username = '';
  message = '';
  messages: any[] = [];
  isConnected = false;
  connectingMessage = 'Connecting ...';

  private wsService = inject(WebsocketService);

  ngOnInit(): void {
    console.log('ChatroomComponent ngOnInit called.');
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      this.username = storedUsername;
      this.initializeWebSocket(storedUsername);
    } else {
      console.log('Usuario no cargado.');
    }
  }

  private initializeWebSocket(username: string): void {
    this.wsService.connect(username);
    this.subscribeToMessages();
    this.subscribeToConnectionStatus();
  }

  private subscribeToMessages(): void {
    this.wsService.messages$.subscribe(message => {
      if (!message) return;
      if (message.type === 'CHAT' && !message.content?.trim()) return; // ignorar chats vacíos

      console.log(`Message received from ${message.sender} : ${message.content} : ${message.timestamp}`);
      this.messages.push(message);
    });
  }


  private subscribeToConnectionStatus(): void {
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
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = 31 * hash + sender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
  }
}
