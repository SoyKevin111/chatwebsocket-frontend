import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WebsocketService } from '../../services/websocket.service';
import { MessagesService } from '../../services/messages.service';

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
  private messageService = inject(MessagesService);

  ngOnInit(): void {
    console.log('ChatroomComponent ngOnInit called.');
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      this.username = storedUsername;

      // cargar mensajes
      this.messageService.findAll().subscribe(messagesFromApi => {
        this.messages = messagesFromApi.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

      // Inicializar WebSocket
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

      // Mantener orden por timestamp después de recibir un nuevo mensaje
      this.messages.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
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


  isSameDay(date1: string | Date, date2: string | Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
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
