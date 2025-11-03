export interface BulkUploadRequest {
  phoneNumbers: string[];
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  stats: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
}

export interface StatsResponse {
  totalContacts: number;
  validContacts: number;
  invalidAttempts: number;
  duplicateAttempts: number;
}

export interface ProcessingResult {
  valid: string[];
  invalid: string[];
  duplicates: string[];
}
