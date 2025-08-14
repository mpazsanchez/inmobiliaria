export interface ProductsPageData {
  categories: ProductCategoryData[];
  featured: ProductSummary[];
}
export interface ProductCategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  applications: string[];
}
export interface ProductSummary {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
}
