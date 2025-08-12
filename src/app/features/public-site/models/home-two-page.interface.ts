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
  companyStats: CompanyStats[];
  companyInfo: { title: string; subtitle: string; description: string };
  showProgressBars: boolean;
  skills: SkillProgress[];
  contactInfo: { description: string; phone: string };
}

export interface CompanyStats {
  value: number;
  label: string;
  unit?: string;
}

export interface SkillProgress {
  name: string;
  percentage: number;
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
