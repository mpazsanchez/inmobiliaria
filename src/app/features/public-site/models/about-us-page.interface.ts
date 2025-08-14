export interface AboutUsPageData {
  companyInfo: CompanyInfo;
  team: TeamMember[];
  stats: StatData[];
  experienceData: ExperienceData;
  productTypes: ProductType[];
  technicalBenefits: TechnicalBenefit[];
  testimonials: Testimonial[];
}
export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  vision: string;
}
export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}
export interface StatData {
  label: string;
  value: string;
}
export interface ExperienceData {
  stats: {
    works: string;
    years: string;
    coverage: string;
  };
  company: {
    title: string;
    subtitle: string;
    description: string;
  };
  gallery: GalleryItem[];
  certification: CertificationData;
}

export interface CertificationData {
  title: string;
  subtitle: string;
  features: CertificationFeature[];
}

export interface CertificationFeature {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  title: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  initials: string;
}

export interface ProductType {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  applications: string[];
}

export interface TechnicalBenefit {
  icon: string;
  title: string;
  description: string;
  percentage?: string;
}
