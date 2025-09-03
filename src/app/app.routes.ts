import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';

export const routes: Routes = [
	{
		path: 'chatroom',
		component: ChatroomComponent
	},
	{
		path: 'auth',
		component: AuthComponent
	},
	{
		path: '**',
		redirectTo: 'auth',
		pathMatch: 'full'
	}
];
