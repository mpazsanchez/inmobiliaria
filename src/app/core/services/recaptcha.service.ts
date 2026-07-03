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
 *
 * El script se carga de forma lazy (solo cuando se necesita por primera vez)
 * para no bloquear el rendimiento de páginas que no tienen formularios.
 */
@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private platformId = inject(PLATFORM_ID);
  private readonly siteKey = environment.recaptcha.siteKey;
  private readonly enabled = environment.recaptcha.enabled;
  private scriptLoadPromise: Promise<void> | null = null;

  /**
   * Verifica si reCAPTCHA está disponible (ya cargado)
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
   * Carga el script de reCAPTCHA de forma lazy (solo la primera vez).
   * Las llamadas subsiguientes reutilizan la misma promesa.
   */
  private loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    // Si ya está cargado, no hacer nada
    if (window.grecaptcha?.enterprise) {
      return Promise.resolve();
    }

    // Reutilizar la promesa si ya se está cargando
    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.scriptLoadPromise = null;
        reject(new Error('No se pudo cargar reCAPTCHA'));
      };
      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  /**
   * Ejecuta reCAPTCHA y obtiene un token de verificación.
   * Carga el script automáticamente si no está disponible.
   *
   * @param action - Nombre de la acción (ej: 'CONTACT', 'LOGIN')
   * @returns Token de verificación o null si falla
   */
  async executeRecaptcha(action: RecaptchaAction): Promise<string | null> {
    if (!this.enabled) {
      console.warn('reCAPTCHA está deshabilitado en este ambiente');
      return null;
    }

    if (!isPlatformBrowser(this.platformId)) {
      console.warn('reCAPTCHA solo funciona en el navegador');
      return null;
    }

    // Cargar el script si aún no está disponible
    try {
      await this.loadScript();
    } catch {
      console.error('Error cargando reCAPTCHA');
      return null;
    }

    if (!window.grecaptcha?.enterprise) {
      console.error('reCAPTCHA Enterprise no está cargado');
      return null;
    }

    try {
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
