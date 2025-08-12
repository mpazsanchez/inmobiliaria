export interface HomePageData {
  hero: HeroSectionData;
  features: FeatureData[];
  testimonials: TestimonialData[];
}
export interface HeroSectionData {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}
export interface FeatureData {
  icon: string;
  title: string;
  description: string;
}
export interface TestimonialData {
  name: string;
  message: string;
  avatar: string;
}
