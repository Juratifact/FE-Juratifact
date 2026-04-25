import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingBag } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useCreateProductComment } from "../hooks/useProduct";
import type { Product, ProductComment } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const conditionVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  New: "default",
  "Like new": "secondary",
  Good: "outline",
};

const conditionColor: Record<string, string> = {
  New: "text-green-600",
  "Like new": "text-blue-600",
  Good: "text-amber-600",
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<ProductComment[]>(
    product.comments ?? [],
  );
  const createCommentMutation = useCreateProductComment();

  const mainImage = useMemo(() => {
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return undefined;
  }, [product.imageUrls]);

  const handleCommentSubmit = () => {
    const content = commentText.trim();
    if (!content) return;

    createCommentMutation.mutate(
      {
        productId: product.id,
        content,
      },
      {
        onSuccess: (created) => {
          setLocalComments((prev) => [
            {
              id: created?.id ?? crypto.randomUUID(),
              content: created?.content ?? content,
              createdAt: created?.createdAt ?? new Date().toISOString(),
              userName: created?.userName ?? "Bạn",
              parentCommentId: created?.parentCommentId,
            },
            ...prev,
          ]);
          setCommentText("");
        },
      },
    );
  };

  return (
    <Card className="h-full overflow-hidden border-border/60 bg-background/95 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="group block">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute right-2 top-2">
            {product.status === 1 ? (
              <Badge variant="default">Available</Badge>
            ) : (
              <Badge variant="destructive">Sold</Badge>
            )}
          </div>

          {/* Condition Badge */}
          <div className="absolute left-2 top-2">
            <Badge
              variant={conditionVariant[product.condition] ?? "outline"}
              className={conditionColor[product.condition]}
            >
              {product.condition}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Description */}
          {product.description && (
            <CardDescription className="line-clamp-2 text-sm">
              {product.description}
            </CardDescription>
          )}

          {/* Price */}
          <div className="text-xl font-extrabold tracking-tight text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-2 border-t">
            <span>
              {new Date(product.createdAt).toLocaleDateString("vi-VN")}
            </span>
            {product.videoUrls && product.videoUrls.length > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Video
              </span>
            )}
          </div>

          {/* Action Button */}
          {onAddToCart && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
            >
              <ShoppingBag className="mr-1 h-4 w-4" />
              Add to cart
            </Button>
          )}
        </CardContent>
      </Link>

      <CardContent className="space-y-3 border-t bg-muted/20 pt-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Comments</p>

          <div className="flex gap-2 mb-3">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCommentSubmit}
              disabled={createCommentMutation.isPending || !commentText.trim()}
            >
              Send
            </Button>
          </div>

          <div className="space-y-2">
            {localComments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No comments yet</p>
            ) : (
              localComments.slice(0, 3).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border bg-background px-2.5 py-2"
                >
                  <div className="text-xs font-medium">
                    {comment.userName ?? "User"}
                  </div>
                  <div className="text-xs text-muted-foreground wrap-break-word">
                    {comment.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
