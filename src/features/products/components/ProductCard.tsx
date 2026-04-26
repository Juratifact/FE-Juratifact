import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MessageCircle, ShoppingBag } from "lucide-react";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
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
    <Card className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={product.sellerProfilePicture}
                alt={
                  product.sellerUserName ?? product.sellerFullName ?? "Seller"
                }
              />
              <AvatarFallback>
                {(product.sellerFullName ?? "Seller").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {product.sellerFullName ?? "Người bán"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {product.sellerUserName
                  ? `@${product.sellerUserName}`
                  : "@unknown"}
              </p>
            </div>
          </div>

          {product.status === 1 ? (
            <Badge variant="secondary">Available</Badge>
          ) : (
            <Badge variant="destructive">Sold</Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge variant={conditionVariant[product.condition] ?? "outline"}>
            {product.condition}
          </Badge>

          <span className="text-xs text-muted-foreground">
            {new Date(product.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </CardHeader>

      <Link to={`/products/${product.id}`} className="group block">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardContent className="space-y-3 pt-4">
          <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary">
            {product.title}
          </CardTitle>

          {product.description && (
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {product.description}
            </CardDescription>
          )}

          <div className="text-2xl font-bold tracking-tight text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {product.videoUrls && product.videoUrls.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                <Eye className="h-3 w-3" />
                Video
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
              <MessageCircle className="h-3 w-3" />
              {localComments.length}
            </span>
          </div>

          {onAddToCart && (
            <Button
              size="sm"
              variant="secondary"
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

      <Separator />

      <CardContent className="space-y-3 bg-muted/30 pt-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Comments</p>

          <div className="mb-3 flex gap-2">
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
                  className="rounded-lg border bg-background px-3 py-2"
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
