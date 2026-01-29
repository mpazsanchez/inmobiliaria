export const environment = {
  production: true,
  apiUrl: 'https://api.fairway.com/api',

  // Cloudinary - Producción
  cloudinary: {
    cloudName: 'TU_CLOUD_NAME',        // Reemplazar con tu cloud name
    uploadPreset: 'fairway_prod',      // Crear preset de producción
    folder: 'fairway'                  // Carpeta de producción
  },

  // reCAPTCHA Enterprise
  recaptcha: {
    siteKey: '6LcGGlksAAAAAF3cxAbGTE4WZZvCYtFgk6jJZWZN',
    enabled: true
  }
};
