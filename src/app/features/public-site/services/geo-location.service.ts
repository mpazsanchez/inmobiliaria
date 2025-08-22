import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {
  location = signal<{ city: string; lat: number; lng: number } | null>(null);

  async getLocationByIP(): Promise<{ city: string; lat: number; lng: number } | null> {
    try {
      // Usamos ipapi.co para simular la obtención de ubicación por IP
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.city && data.latitude && data.longitude) {
        return { city: data.city, lat: data.latitude, lng: data.longitude };
      }
    } catch {
      // Fallback
      return null;
    }
    return null;
  }
}
