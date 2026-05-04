// Minimal shape/type for the identify request payload.
export type IdentifyFormData = {
  IdCardFrontUrl: File | null;
  IdCardBackUrl: File | null;
  SelfieUrl: File | null;
};

// Shape used by the form inputs. File inputs expose FileList in the browser.
export type IdentifyFormValues = {
  IdCardFrontUrl: FileList;
  IdCardBackUrl: FileList;
  SelfieUrl: FileList;
};
