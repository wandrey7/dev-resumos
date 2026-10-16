import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado) {
    router.navigate(['/login'], { queryParams: { redirectUrl: '/admin' } });
    return false;
  }

  if (!authService.ehAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
