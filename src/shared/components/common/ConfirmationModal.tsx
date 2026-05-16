import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  onConfirm,
  onCancel,
  isPending,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:opacity-100"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6 pt-8 text-center">
          <div className={cn(
            "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
            variant === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}>
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="rounded-full px-6 sm:order-1"
              onClick={onCancel}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              className="rounded-full px-8 shadow-sm sm:order-2"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
