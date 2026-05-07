// ─── IdentifyDocument Entity ─────────────────────────────
export interface IdentifyUser {
  id: string;
  fullName?: string | null;
  email?: string | null;
  profilePicture?: string | null;
}

export interface IdentifyDocument {
  id: string;
  userId?: string;
  user?: IdentifyUser;
  idCardFrontUrl: string;
  idCardBackUrl: string;
  selfieUrl: string;
  status: number; 
  note?: string | null;
  message?: string;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type IdentifyDocumentData = IdentifyDocument;

export interface IdentifyDocumentResponse {
  success: boolean;
  message: string;
  data?: IdentifyDocument;
  traceId?: string;
}

// ─── Create / Update DTOs ────────────────────────────────
export interface CreateIdentifyDto {
  idCardFrontUrl: string;
  idCardBackUrl: string;
  selfieUrl: string;
}

export interface UpdateIdentifyDto {
  documentId: string;
  idCardFrontUrl?: string | File;
  idCardBackUrl?: string | File;
  selfieUrl?: string | File;
}
