import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  username = '';

  private wsService = inject(WebsocketService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('conexion');
  }

  register(): void {
    if (!this.username.trim()) {
      console.warn('El nombre de usuario no puede estar vacío.');
      return;
    }

    this.userService.register(this.username).subscribe({
      next: () => {
        console.log('Usuario registrado correctamente');
        localStorage.setItem('username', this.username);
        localStorage.setItem('conexion', 'true');
        localStorage.setItem('isNewUser', 'true');
        this.router.navigate(['/chatroom']);
      },
      error: err => console.error('Error al registrar:', err),
      complete: () => console.log('Registro finalizado')
    });
  }



  login(): void {
    if (!this.username.trim()) {
      console.warn('El nombre de usuario no puede estar vacío.');
      return;
    }

    this.userService.login(this.username).subscribe({
      next: () => {
        console.log('Usuario logeado correctamente');
        localStorage.setItem('username', this.username);
        localStorage.setItem('conexion', 'true');
        localStorage.setItem('isNewUser', 'false');
        this.router.navigate(['/chatroom']);
      },
      error: err => console.error('Error al logear:', err),
      complete: () => console.log('Login finalizado')
    });
  }
}
