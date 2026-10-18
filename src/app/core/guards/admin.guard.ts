import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado) {
    return router.createUrlTree(['/login'], { queryParams: { redirectUrl: '/admin' } });
  }

  if (!authService.ehAdmin) {
    return router.createUrlTree(['/']);
  }

  return true;
};
