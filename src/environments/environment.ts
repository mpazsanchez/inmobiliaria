export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',

  // Cloudinary - Configurar con tus credenciales
  cloudinary: {
    cloudName: 'TU_CLOUD_NAME',        // Reemplazar con tu cloud name
    uploadPreset: 'fairway_unsigned',  // Crear en Cloudinary Dashboard
    folder: 'fairway-dev'              // Carpeta para desarrollo
  },

  // reCAPTCHA Enterprise
  recaptcha: {
    siteKey: '6LcGGlksAAAAAF3cxAbGTE4WZZvCYtFgk6jJZWZN',
    enabled: true
  }
};

