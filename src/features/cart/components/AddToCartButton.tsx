import { Button } from "@/shared/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export function AddToCartButton({
  onClick,
  disabled = false,
  isLoading = false,
  size = "default",
  variant = "default",
  className = "",
}: AddToCartButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size={size}
      variant={variant}
      className={className}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
    </Button>
  );
}
