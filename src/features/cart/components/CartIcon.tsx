import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  size?: number;
  className?: string;
}

export function CartIcon({ size = 5, className = "" }: CartIconProps) {
  return <ShoppingCart className={`h-${size} w-${size} ${className}`} />;
}
