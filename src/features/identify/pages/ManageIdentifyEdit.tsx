import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { IdentifyForm } from "../components/IdentifyForm";
import {
  useGetMyIdentifyDocument,
  useReSubmitIdentifyDocument,
} from "../hooks/useIdentify";

export default function ManageIdentifyEdit() {
  const { data: document, isLoading } = useGetMyIdentifyDocument();
  const { mutate: reSubmitIdentify, isPending } = useReSubmitIdentifyDocument();

  const handleSubmit = (data: {
    idCardFrontUrl: File;
    idCardBackUrl: File;
    selfieUrl: File;
  }) => {
    if (!document) return;

    reSubmitIdentify({
      updateData: {
        documentId: document.id,
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        selfieUrl: data.selfieUrl,
      },
      onUploadProgress: (event) => {
        console.log("Upload progress:", event);
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!document) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Không tìm thấy tài liệu xác minh.
        </p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/identify">Quay lại</Link>
        </Button>
      </div>
    );
  }

  if (document.status !== 2) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Chỉ có thể gửi lại tài liệu bị từ chối.
        </p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/identify">Quay lại</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/identify">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Gửi lại tài liệu xác minh</h2>

      {document.message && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            Lý do từ chối: {document.message}
          </p>
        </div>
      )}

      <IdentifyForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Gửi lại"
      />
    </div>
  );
}
