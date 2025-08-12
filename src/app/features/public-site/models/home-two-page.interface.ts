export interface HomeTwoPageData {
  heroSliders: SliderItem[];
  aboutCompany: AboutCompanyData;
  services: ServiceData[];
  experience: ExperienceData;
  faqs: FaqData[];
}

export interface SliderItem {
  id: string;
  imageUrl: string;
  altText: string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    action: string;
  };
  secondaryButton?: {
    text: string;
    action: string;
  };
}

export interface AboutCompanyData {
  bannerImage: string;
  // otros campos relevantes
}

export interface ServiceData {
  // ...
}

export interface ExperienceData {
  // ...
}

export interface FaqData {
  // ...
}
