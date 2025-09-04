import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const chatroomGuard: CanActivateFn = () => {

  const router = inject(Router);

  if (localStorage.getItem('conexion') === 'true') {
    return true;
  }
  else {
    router.navigate(['auth']);
    return false;
  }
};
