const https = require('https');
const http = require('http');

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dvbhqr8nu';
const CLOUDINARY_UPLOAD_PRESET = 'fairway';
const CLOUDINARY_FOLDER = 'fairway/properties';

// Mapeo de imágenes: { originalUrl: cloudinaryUrl }
const imageMapping = new Map();

/**
 * Descarga una imagen desde una URL
 */
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirección
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Genera boundary para multipart/form-data
 */
function generateBoundary() {
  return '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
}

/**
 * Crea el body de multipart/form-data manualmente
 */
function createMultipartBody(imageBuffer, filename, boundary) {
  const parts = [];
  
  // Campo 'file'
  parts.push(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: image/jpeg\r\n\r\n`
  );
  parts.push(imageBuffer);
  parts.push('\r\n');
  
  // Campo 'upload_preset'
  parts.push(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="upload_preset"\r\n\r\n` +
    `${CLOUDINARY_UPLOAD_PRESET}\r\n`
  );
  
  // Campo 'folder'
  parts.push(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="folder"\r\n\r\n` +
    `${CLOUDINARY_FOLDER}\r\n`
  );
  
  // Cierre
  parts.push(`--${boundary}--\r\n`);
  
  // Convertir a Buffer
  const buffers = parts.map(part => 
    typeof part === 'string' ? Buffer.from(part, 'utf-8') : part
  );
  
  return Buffer.concat(buffers);
}

/**
 * Sube una imagen a Cloudinary
 */
function uploadToCloudinary(imageBuffer, filename) {
  return new Promise((resolve, reject) => {
    const boundary = generateBoundary();
    const body = createMultipartBody(imageBuffer, filename, boundary);
    
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };

    const req = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            resolve(result.secure_url);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Procesa y migra una URL de imagen
 */
async function migrateImage(unsplashUrl, description, index) {
  // Si ya la procesamos, devolver la URL cacheada
  if (imageMapping.has(unsplashUrl)) {
    console.log(`  ✓ [${index}] Ya migrada (cache): ${description}`);
    return imageMapping.get(unsplashUrl);
  }

  try {
    console.log(`  → [${index}] Descargando: ${description}...`);
    const imageBuffer = await downloadImage(unsplashUrl);
    
    console.log(`  → [${index}] Subiendo a Cloudinary...`);
    const filename = `${description.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
    const cloudinaryUrl = await uploadToCloudinary(imageBuffer, filename);
    
    // Guardar en cache
    imageMapping.set(unsplashUrl, cloudinaryUrl);
    
    console.log(`  ✓ [${index}] Migrada exitosamente: ${description}`);
    console.log(`    ${cloudinaryUrl}`);
    return cloudinaryUrl;
  } catch (error) {
    console.error(`  ✗ [${index}] Error migrando ${description}:`, error.message);
    return unsplashUrl; // Mantener original en caso de error
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   MIGRACIÓN DE IMÁGENES: UNSPLASH → CLOUDINARY        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`Cloud Name: ${CLOUDINARY_CLOUD_NAME}`);
  console.log(`Preset: ${CLOUDINARY_UPLOAD_PRESET}`);
  console.log(`Folder: ${CLOUDINARY_FOLDER}\n`);

  // Cargar el archivo de mocks
  const mockPath = '../src/app/core/services/mock-data/properties.mock.ts';
  const fs = require('fs');
  const path = require('path');
  
  let fileContent = fs.readFileSync(path.resolve(__dirname, mockPath), 'utf-8');

  // Extraer todas las URLs de Unsplash
  const unsplashUrlRegex = /https:\/\/images\.unsplash\.com\/[^\s'"]+/g;
  const allUrls = fileContent.match(unsplashUrlRegex) || [];
  const uniqueUrls = [...new Set(allUrls)];

  console.log(`Encontradas ${uniqueUrls.length} imágenes únicas de Unsplash\n`);

  // Migrar cada imagen
  let migratedCount = 0;
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    console.log(`[${i + 1}/${uniqueUrls.length}] Procesando imagen...`);
    
    // Extraer descripción del contexto (si es posible)
    const descMatch = fileContent.match(new RegExp(`url:\\s*'${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*descripcion:\\s*'([^']+)'`));
    const description = descMatch ? descMatch[1] : `imagen-${i + 1}`;
    
    const cloudinaryUrl = await migrateImage(url, description, i + 1);
    
    if (cloudinaryUrl !== url) {
      migratedCount++;
    }
    
    // Pequeña pausa entre uploads para no saturar
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║   RESUMEN DE MIGRACIÓN                                 ║`);
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`Total imágenes: ${uniqueUrls.length}`);
  console.log(`Migradas: ${migratedCount}`);
  console.log(`Errores: ${uniqueUrls.length - migratedCount}\n`);

  // Actualizar el archivo
  console.log('Actualizando archivo properties.mock.ts...');
  
  imageMapping.forEach((cloudinaryUrl, unsplashUrl) => {
    fileContent = fileContent.replace(new RegExp(unsplashUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cloudinaryUrl);
  });

  // Backup del original
  const backupPath = path.resolve(__dirname, mockPath + '.backup');
  fs.writeFileSync(backupPath, fs.readFileSync(path.resolve(__dirname, mockPath)));
  console.log(`✓ Backup guardado: ${backupPath}`);

  // Guardar archivo actualizado
  fs.writeFileSync(path.resolve(__dirname, mockPath), fileContent);
  console.log(`✓ Archivo actualizado: ${mockPath}`);

  console.log('\n✅ MIGRACIÓN COMPLETADA\n');
  
  // Mostrar mapeo
  console.log('Mapeo de URLs:');
  console.log('═'.repeat(60));
  imageMapping.forEach((cloudinaryUrl, unsplashUrl) => {
    console.log(`${unsplashUrl.substring(0, 50)}...`);
    console.log(`  → ${cloudinaryUrl}\n`);
  });
}

// Ejecutar
main().catch(error => {
  console.error('❌ ERROR FATAL:', error);
  process.exit(1);
});
