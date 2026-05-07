
export type IdentifyFormData = {
  IdCardFrontUrl: File | null;
  IdCardBackUrl: File | null;
  SelfieUrl: File | null;
};

export type IdentifyFormValues = {
  IdCardFrontUrl: FileList;
  IdCardBackUrl: FileList;
  SelfieUrl: FileList;
};
