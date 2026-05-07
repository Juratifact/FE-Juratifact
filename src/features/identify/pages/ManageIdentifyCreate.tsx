import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { IdentifyForm } from "../components/IdentifyForm";
import { useSubmitIdentifyDocument } from "../hooks/useIdentify";


export default function ManageIdentifyCreate() {
  const { mutate: submitIdentify, isPending } = useSubmitIdentifyDocument();

  const handleSubmit = (data: {
    idCardFrontUrl: File;
    idCardBackUrl: File;
    selfieUrl: File;
  }) => {
    const formData = new FormData();
    formData.append("idCardFrontUrl", data.idCardFrontUrl);
    formData.append("idCardBackUrl", data.idCardBackUrl);
    formData.append("selfieUrl", data.selfieUrl);

    submitIdentify({
      formData,
      onUploadProgress: (event) => {
        console.log("Upload progress:", event);
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/identify">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Gửi tài liệu xác minh</h2>

      <IdentifyForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Gửi tài liệu"
      />
    </div>
  );
}
