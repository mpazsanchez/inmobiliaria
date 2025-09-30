// Resumen para productos relacionados y listados
export interface ProductSummary {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
}
/**
 * Interfaces para el sistema de productos de Glazing.me
 * Sigue la arquitectura modular y escalable definida en README.md
 */

// Base para características del producto
export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

// Especificaciones técnicas
export interface TechnicalSpec {
  property: string;
  value: string;
  unit?: string;
}

// Preguntas frecuentes / Desafíos
export interface ProductChallenge {
  question: string;
  answer: string;
  isOpen: boolean;
}

// Tipos o variaciones del producto
export interface ProductType {
  name: string;
  description: string;
  uvProtection?: string;
  irReduction?: string;
  solarEnergyRejection?: string;
  finish?: string;
  keyBenefits: string[];
  specifications?: TechnicalSpec[];
}

// Banner de llamada a la acción
export interface ProductBanner {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonAction: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
}

// Elemento de navegación de productos relacionados
export interface ProductNavigationItem {
  name: string;
  link: string;
  isActive?: boolean;
}

// Datos de contenido hero específico para productos
export interface ProductHeroData {
  bannerImage: string;
  title: string;
  subtitle: string;
  breadcrumbTextOne: string;
  breadcrumbTextTwo: string;
  breadcrumbTextThree: string;
}

// Contenido principal del producto
export interface ProductContent {
  mainImage: string;
  mainImageAlt: string;
  title: string;
  description?: string[];
  blocks?: Array<{
    subtitle: string;
    items: string[];
  }>;
  highlightedFeatures: string[];
}

// Modelo principal de producto - Genérico y extensible
export interface Product {
  // Identificación
  id: string;
  slug: string;
  category: ProductCategory;
  
  // Contenido básico
  name: string;
  shortDescription: string;
  longDescription: string[];
  
  // Hero section
  heroData: ProductHeroData;
  
  // Contenido principal
  content: ProductContent;
  
  // Características y especificaciones
  features: ProductFeature[];
  specifications: TechnicalSpec[];
  types?: ProductType[];
  
  // Interacciones
  challenges: ProductChallenge[];
  banner?: ProductBanner;
  
  // Navegación
  relatedProducts: ProductNavigationItem[];
  
  // SEO y metadatos
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // Estado
  isActive: boolean;
  featured: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Categorías de productos
export enum ProductCategory {
  SOLAR_FILMS = 'solar-films',
  SECURITY_FILMS = 'security-films',
  DECORATIVE_FILMS = 'decorative-films',
  AUTOMOTIVE_FILMS = 'automotive-films',
  CERAMIC_COATINGS = 'ceramic-coatings'
}

// Filtros para productos
export interface ProductFilters {
  category?: ProductCategory;
  featured?: boolean;
  isActive?: boolean;
  search?: string;
}

// Respuesta de la API para listado de productos
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTO para crear/actualizar productos (para futuro admin panel)
export interface CreateProductDto {
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string[];
  heroData: ProductHeroData;
  content: ProductContent;
  features: ProductFeature[];
  specifications: TechnicalSpec[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}
