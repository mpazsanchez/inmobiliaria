export interface ProductDetailPageData {
  product: ProductDetailData;
  related: ProductSummary[];
}
export interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  images: string[];
  features: string[];
  specs: ProductSpec[];
}
export interface ProductSpec {
  label: string;
  value: string;
}
export interface ProductSummary {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
}
