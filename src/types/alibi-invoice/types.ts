export interface DummyRequestFormData {
  executionDate: string;
  requestorName: string;
  productName: string;
}

export interface FormErrors {
  executionDate?: string;
  requestorName?: string;
  productName?: string;
}
