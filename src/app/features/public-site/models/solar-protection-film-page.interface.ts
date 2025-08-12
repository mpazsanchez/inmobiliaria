
import { ProductHeroData, ProductContent, ProductFeature, TechnicalSpec, ProductType, ProductChallenge, ProductBanner, ProductNavigationItem } from './product.interface';

export interface SolarProtectionFilmPageData {
  heroData: ProductHeroData;
  content: ProductContent;
  features: ProductFeature[];
  specifications: TechnicalSpec[];
  types: ProductType[];
  challenges: ProductChallenge[];
  banner: ProductBanner;
  relatedProducts: ProductNavigationItem[];
}
