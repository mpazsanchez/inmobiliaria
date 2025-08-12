export interface ContactPageData {
  form: ContactFormData;
  info: ContactInfoData;
}
export interface ContactFormData {
  fields: ContactField[];
  submitText: string;
}
export interface ContactField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}
export interface ContactInfoData {
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}
