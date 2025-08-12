export interface AboutUsPageData {
  companyInfo: CompanyInfo;
  team: TeamMember[];
  stats: StatData[];
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
