import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { chatroomGuard } from './guards/chatroom.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full'
	},
	{
		path: 'chatroom',
		component: ChatroomComponent,
		canActivate: [chatroomGuard]
	},
	{
		path: 'auth',
		component: AuthComponent
	},
	{
		path: '**',
		redirectTo: 'auth'
	}
];
