import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Solicitud inválida. Verifica los datos enviados.',
  401: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'Recurso no encontrado.',
  409: 'El recurso ya existe o hay un conflicto.',
  422: 'Datos inválidos. Verifica la información enviada.',
  429: 'Demasiadas solicitudes. Por favor intenta más tarde.',
  500: 'Error interno del servidor. Intenta nuevamente más tarde.',
  503: 'Servicio no disponible temporalmente.',
};

const SPECIAL_HANDLERS: Record<number, (toastService: ToastService, router: Router, error: HttpErrorResponse) => void> = {
  401: (toastService, router, error) => {
    toastService.error(ERROR_MESSAGES[401]);
    router.navigate(['/member-area/login']);
  },
  429: (toastService) => {
    toastService.warning(ERROR_MESSAGES[429]);
  },
  503: (toastService) => {
    toastService.warning(ERROR_MESSAGES[503]);
  },
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      // Ignorar errores de servicios externos (Cloudinary, etc.)
      if (req.url.includes('cloudinary.com')) {
        // No interceptar, dejar que el servicio lo maneje
        return throwError(() => error);
      }

      // Errores del cliente o de red
      if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
        toastService.error(errorMessage);
        return throwError(() => error);
      }

      // Errores del servidor
      errorMessage = ERROR_MESSAGES[error.status] || `Error del servidor: ${error.status}`;

      // Manejadores especiales (401, 429, 503)
      const specialHandler = SPECIAL_HANDLERS[error.status];
      if (specialHandler) {
        specialHandler(toastService, router, error);
        return throwError(() => error);
      }

      // Mostrar toast con el error
      toastService.error(errorMessage);

      // Propagar el error para que los componentes puedan manejarlo si es necesario
      return throwError(() => error);
    })
  );
};
