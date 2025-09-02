import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: Client | null = null;

  private messageSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messageSubject.asObservable();

  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionSubject.asObservable();

  connect(username: string) {
    const socket = new SockJS('http://localhost:8080/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // reintento de conexión automática
      debug: (str) => console.log(str)
    });

    // Manejo de conexión exitosa
    this.stompClient.onConnect = (frame) => {
      console.log('Conectado al servidor WebSocket');

      // Actualiza estado de conexión
      this.connectionSubject.next(true);

      // Suscribirse al topic público
      this.stompClient?.subscribe('/topic/public', (message: Message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });

      // Notificar al servidor que un usuario se ha conectado
      this.stompClient?.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' })
      });
    };

    // Manejo de errores reportados por el broker
    this.stompClient.onStompError = (frame) => {
      console.error('Error reportado por el broker: ' + frame.headers['message']);
      console.error('Detalles adicionales: ' + frame.body);
    };

    // Activar conexión
    this.stompClient.activate();
  }

  sendMessage(username: string, content: string) {
    if (this.stompClient && this.stompClient.connected) {
      const chatMessage = {
        sender: username,
        content: content,
        type: 'CHAT'
      };

      console.log('Mensaje enviado por: ' + username + " content: " + content);

      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.error('WebSocket no está conectado');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connectionSubject.next(false);
      console.log('Desconectado del servidor WebSocket');
    }
  }
}
