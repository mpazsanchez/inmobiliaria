export interface HomeTwoPageData {
  heroSliders: SliderItem[];
  aboutCompany: AboutCompanyData;
  services: ServiceSectionData;
  experience: ExperienceSectionData;
  faqs: FaqSectionData;
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
  companyInfo: { title: string; subtitle: string; description: string, ctaText: string };
  showProgressBars: boolean;
  skills: SkillProgress[];
  contactInfo: { description: string; phone: string };
  founderInfo: { name: string; signature: string; photo: string };
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

export interface ServiceSectionData {
  sectionInfo: {
    subtitle: string;
    title: string;
  };
  services: ServiceItem[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export interface ExperienceSectionData {
  showCertification?: boolean;
  showCta?: boolean;
  isAboutComponent?: boolean;
  experienceData: any;
}

export interface FaqSectionData {
  faqItems: FAQItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}
