import { Product, ProductSummary } from './product.interface';

export interface ProductDetailPageData {
  product: Product;
  related: ProductSummary[];
}
