export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',

  // Cloudinary - Configurar con tus credenciales
  cloudinary: {
    cloudName: 'dvbhqr8nu',
    uploadPreset: 'fairway', 
    folder: 'fairway'
  },

  // CLOUDINARY_URL=cloudinary:321548118555262:EMNQUZD00AxmVJzch8DghZJV9TE@dvbhqr8nu,

  // reCAPTCHA Enterprise
  recaptcha: {
    siteKey: '6LcGGlksAAAAAF3cxAbGTE4WZZvCYtFgk6jJZWZN',
    enabled: true
  }
};

