import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

/**
 * Tipo global para la API de reCAPTCHA Enterprise
 */
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
        reset: (widgetId?: number) => void;
      };
    };
  }
}

/**
 * Acciones de reCAPTCHA para diferentes formularios
 * Usar nombres descriptivos para análisis en Google Console
 */
export type RecaptchaAction = 'CONTACT' | 'LOGIN' | 'PROPERTY_INQUIRY' | 'REGISTER';

/**
 * Servicio para integración con Google reCAPTCHA Enterprise
 
 * Uso:
 * 1. Inyectar el servicio en el componente
 * 2. Llamar a executeRecaptcha('ACTION') antes de enviar el formulario
 * 3. Enviar el token al backend junto con los datos del formulario
 * 4. El backend debe validar el token con la API de Google
 */
@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private platformId = inject(PLATFORM_ID);
  private readonly siteKey = environment.recaptcha.siteKey;
  private readonly enabled = environment.recaptcha.enabled;

  /**
   * Verifica si reCAPTCHA está disponible
   */
  get isAvailable(): boolean {
    return (
      this.enabled &&
      isPlatformBrowser(this.platformId) &&
      typeof window !== 'undefined' &&
      !!window.grecaptcha?.enterprise
    );
  }

  /**
   * Ejecuta reCAPTCHA y obtiene un token de verificación
   *
   * @param action - Nombre de la acción (ej: 'CONTACT', 'LOGIN')
   * @returns Token de verificación o null si falla
   */
  async executeRecaptcha(action: RecaptchaAction): Promise<string | null> {
    // Si reCAPTCHA está deshabilitado, retornar null (el backend debe manejar esto)
    if (!this.enabled) {
      console.warn('reCAPTCHA está deshabilitado en este ambiente');
      return null;
    }

    // Verificar que estamos en el browser
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('reCAPTCHA solo funciona en el navegador');
      return null;
    }

    // Verificar que la API está disponible
    if (!window.grecaptcha?.enterprise) {
      console.error('reCAPTCHA Enterprise no está cargado');
      return null;
    }

    try {
      // Esperar a que reCAPTCHA esté listo y ejecutar
      return await new Promise<string>((resolve, reject) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(this.siteKey, {
              action: action
            });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA:', error);
      return null;
    }
  }

  /**
   * Resetea el widget de reCAPTCHA (si es necesario)
   */
  reset(): void {
    if (this.isAvailable) {
      window.grecaptcha.enterprise.reset();
    }
  }
}
