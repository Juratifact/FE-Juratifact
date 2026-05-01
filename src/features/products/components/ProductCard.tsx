import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  MessageCircle,
  MoreHorizontal,
  ShoppingBag,
  Send,
  X,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import {
  useCreateProductComment,
  useProductComments,
} from "../hooks/useProduct";
import { useCreateProductReport } from "@/features/reports/hooks/useReports";
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

type CommentNode = ProductComment & { children: CommentNode[] };

const buildCommentTree = (comments: ProductComment[]) => {
  const commentMap = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, children: [] });
  });

  commentMap.forEach((comment) => {
    if (comment.parentCommentId && commentMap.has(comment.parentCommentId)) {
      commentMap.get(comment.parentCommentId)?.children.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

function CommentThreadNode({
  node,
  depth = 0,
  onReply,
}: {
  node: CommentNode;
  depth?: number;
  onReply: (comment: ProductComment) => void;
}) {
  const displayName = node.displayName ?? node.userName ?? "User";

  return (
    <div className={cn("space-y-2", depth > 0 && "pl-4")}>
      <div
        className={cn(
          "rounded-2xl border bg-background p-3 shadow-sm",
          depth > 0 && "border-dashed bg-muted/20",
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0 border">
            <AvatarFallback>
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="truncate text-sm font-semibold">{displayName}</p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => onReply(node)}
              >
                Reply
              </Button>
            </div>

            <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
              {node.content}
            </p>

            <p className="mt-2 text-[11px] text-muted-foreground">
              {new Date(node.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="space-y-2 border-l border-dashed border-muted-foreground/20 pl-3">
          {node.children.map((child) => (
            <CommentThreadNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [commentText, setCommentText] = useState("");
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<ProductComment | null>(
    null,
  );
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const createCommentMutation = useCreateProductComment();
  const { data: serverComments = [] } = useProductComments(product.id);

  const createReportMutation = useCreateProductReport();

  const mainImage = useMemo(() => {
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return undefined;
  }, [product.imageUrls]);

  const commentTree = useMemo(
    () => buildCommentTree(serverComments),
    [serverComments],
  );

  const handleCommentSubmit = () => {
    const content = commentText.trim();
    if (!content) return;

    createCommentMutation.mutate(
      {
        productId: product.id,
        content,
        parentCommentId: replyToComment?.id,
      },
      {
        onSuccess: () => {
          setCommentText("");
          setReplyToComment(null);
        },
      },
    );
  };

  const handleReportSubmit = () => {
    const reason = reportReason.trim();
    if (!reason) return;

    createReportMutation.mutate(
      {
        productId: product.id,
        reason,
        description: reportDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReportReason("");
          setReportDescription("");
          setIsActionOpen(false);
          setIsReportOpen(false);
        },
      },
    );
  };

  return (
    <>
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
                  {(product.sellerFullName ?? "Seller")
                    .slice(0, 2)
                    .toUpperCase()}
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

            <div className="relative flex items-center gap-2">
              {product.status === 1 ? (
                <Badge variant="secondary">Available</Badge>
              ) : (
                <Badge variant="destructive">Sold</Badge>
              )}

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsCommentsOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsActionOpen((prev) => !prev)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {isActionOpen && (
                <div className="absolute right-0 top-10 z-20 min-w-32 rounded-xl border bg-background p-1.5 shadow-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-full justify-start rounded-lg text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    onClick={() => {
                      setIsReportOpen(true);
                      setIsActionOpen(false);
                    }}
                  >
                    Report
                  </Button>
                </div>
              )}
            </div>
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
                {serverComments.length}
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
          <div className="flex items-center justify-between gap-2 text-sm">
            <p className="font-semibold">Comments</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-full px-3"
              onClick={() => setIsCommentsOpen(true)}
            >
              Open thread
            </Button>
          </div>

          <div className="space-y-2">
            {serverComments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No comments yet</p>
            ) : (
              serverComments.slice(0, 2).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border bg-background px-3 py-2"
                >
                  <div className="text-xs font-medium">
                    {comment.displayName ?? comment.userName ?? "User"}
                  </div>
                  <div className="wrap-break-word text-xs text-muted-foreground">
                    {comment.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {isCommentsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-3 py-6 backdrop-blur-sm"
          onClick={() => {
            setIsCommentsOpen(false);
            setReplyToComment(null);
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hidden w-[55%] bg-black md:block">
              <div className="flex h-full items-center justify-center bg-muted">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full max-w-full flex-col md:w-[45%]">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Comments</p>
                  <p className="text-xs text-muted-foreground">
                    {serverComments.length} comments
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    setIsCommentsOpen(false);
                    setReplyToComment(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mb-4 flex items-center gap-3 rounded-2xl border bg-muted/20 p-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={product.sellerProfilePicture}
                      alt={product.sellerFullName ?? "Seller"}
                    />
                    <AvatarFallback>
                      {(product.sellerFullName ?? "Seller")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {product.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.sellerFullName ?? "Người bán"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {commentTree.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No comments yet. Be the first to comment.
                    </p>
                  ) : (
                    commentTree.map((node) => (
                      <CommentThreadNode
                        key={node.id}
                        node={node}
                        onReply={(comment) => {
                          setReplyToComment(comment);
                          setCommentText("");
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="border-t bg-background p-4">
                {replyToComment && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-3 py-2 text-xs">
                    <span>
                      Replying to{" "}
                      {replyToComment.displayName ??
                        replyToComment.userName ??
                        "User"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full px-2"
                      onClick={() => setReplyToComment(null)}
                    >
                      Clear
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      replyToComment
                        ? `Reply to ${replyToComment.displayName ?? replyToComment.userName ?? "user"}...`
                        : "Add a comment..."
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCommentSubmit}
                    disabled={
                      createCommentMutation.isPending || !commentText.trim()
                    }
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
          onClick={() => setIsReportOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-orange-200/70 bg-background p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Report product</h3>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsReportOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 rounded-xl border border-orange-200/70 bg-white/90 p-3 dark:border-orange-900/50 dark:bg-background/70">
              <Input
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for report"
                disabled={createReportMutation.isPending}
                className="rounded-xl border-orange-200 bg-white/95 shadow-sm focus-visible:ring-orange-400 dark:border-orange-900"
              />
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Tell us more details (optional)"
                rows={4}
                disabled={createReportMutation.isPending}
                className="w-full rounded-xl border border-orange-200 bg-white/95 px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-orange-400 dark:border-orange-900 dark:bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReportOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-sm hover:from-orange-600 hover:to-rose-600"
                  onClick={handleReportSubmit}
                  disabled={
                    createReportMutation.isPending || !reportReason.trim()
                  }
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  {createReportMutation.isPending
                    ? "Submitting..."
                    : "Submit report"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
