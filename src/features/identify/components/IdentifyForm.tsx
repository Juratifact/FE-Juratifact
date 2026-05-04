import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface IdentifyFormProps {
  onSubmit: (data: {
    idCardFrontUrl: File;
    idCardBackUrl: File;
    selfieUrl: File;
  }) => void;
  isPending?: boolean;
  submitLabel?: string;
}

/**
 * Form submit/re-submit tài liệu xác minh.
 * Cho phép upload 3 ảnh: CMND mặt trước, mặt sau, và selfie.
 */
export function IdentifyForm({
  onSubmit,
  isPending = false,
  submitLabel = "Gửi tài liệu",
}: IdentifyFormProps) {
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const newErrors = { ...errors };
    delete newErrors[fieldName];

    if (file.size > 10 * 1024 * 1024) {
      newErrors[fieldName] = "File không được vượt quá 10MB";
    } else if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      newErrors[fieldName] = "Chỉ hỗ trợ file JPG, PNG, WEBP";
    }

    setErrors(newErrors);
    setFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!frontFile) newErrors.front = "Vui lòng chọn ảnh mặt trước CMND";
    if (!backFile) newErrors.back = "Vui lòng chọn ảnh mặt sau CMND";
    if (!selfieFile) newErrors.selfie = "Vui lòng chọn ảnh selfie";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (frontFile && backFile && selfieFile) {
      onSubmit({
        idCardFrontUrl: frontFile,
        idCardBackUrl: backFile,
        selfieUrl: selfieFile,
      });
    }
  };

  const renderFileInput = (
    label: string,
    fieldName: string,
    ref: React.RefObject<HTMLInputElement | null>,
    file: File | null,
    setFile: (file: File | null) => void,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <input
        ref={ref}
        id={fieldName}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e, setFile, fieldName)}
      />
      <label
        htmlFor={fieldName}
        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
      >
        {file ? (
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">{file.name}</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Chọn hoặc kéo thả ảnh</p>
          </div>
        )}
      </label>
      {errors[fieldName] && (
        <p className="text-sm text-destructive">{errors[fieldName]}</p>
      )}
    </div>
  );

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Xác minh tài liệu</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-300">
            Vui lòng tải lên ảnh rõ ràng, không bị che khuất. Ảnh phải là JPG,
            PNG hoặc WEBP, kích thước không vượt quá 10MB.
          </div>

          {renderFileInput(
            "Ảnh CMND mặt trước",
            "front",
            frontRef,
            frontFile,
            setFrontFile,
          )}
          {renderFileInput(
            "Ảnh CMND mặt sau",
            "back",
            backRef,
            backFile,
            setBackFile,
          )}
          {renderFileInput(
            "Ảnh selfie",
            "selfie",
            selfieRef,
            selfieFile,
            setSelfieFile,
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
