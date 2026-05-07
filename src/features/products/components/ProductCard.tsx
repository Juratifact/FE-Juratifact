import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  ChevronDown,
  ChevronUp,
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
import { useAuthStore } from "@/features/auth/store";
import type { Product, ProductComment } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  mode?: "default" | "owner";
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const conditionVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  New: "default",
  "Like new": "secondary",
  Good: "outline",
};

type CommentNode = ProductComment & {
  children: CommentNode[];
};

interface CommentThreadNodeProps {
  node: CommentNode;
  depth?: number;
  onReply: (comment: ProductComment) => void;
}

const buildCommentTree = (comments: ProductComment[]) => {
  const nodeMap = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodeMap.set(comment.id, { ...comment, children: [] });
  });

  comments.forEach((comment) => {
    const node = nodeMap.get(comment.id);
    if (!node) return;

    if (comment.parentCommentId && nodeMap.has(comment.parentCommentId)) {
      nodeMap.get(comment.parentCommentId)?.children.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
};

const countCommentTree = (nodes: CommentNode[]): number =>
  nodes.reduce((total, node) => total + 1 + countCommentTree(node.children), 0);

function CommentThreadNode({
  node,
  depth = 0,
  onReply,
}: CommentThreadNodeProps) {
  const [isRepliesOpen, setIsRepliesOpen] = useState(depth > 0);
  const displayName = node.displayName ?? node.userName ?? "User";
  const hasReplies = node.children.length > 0;
  const repliesLabel = Math.max(node.replyCount ?? 0, node.children.length);

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
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {new Date(node.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground">
              {node.content}
            </p>
          </div>
        </div>

        <div className={cn("mt-2", depth > 0 && "pl-11")}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onReply(node)}
          >
            Reply
          </Button>
        </div>

        {hasReplies && (
          <button
            type="button"
            className={cn(
              "mt-3 flex items-center gap-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              depth > 0 && "pl-11",
            )}
            onClick={() => setIsRepliesOpen((prev) => !prev)}
          >
            <span className="h-px w-8 bg-border" />
            <span>
              {isRepliesOpen
                ? "Hide replies"
                : `View replies (${repliesLabel})`}
            </span>
            {isRepliesOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {hasReplies && isRepliesOpen && (
        <div className="space-y-2 border-l border-border/70 pl-4">
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

export function ProductCard({
  product,
  onAddToCart,
  mode = "default",
  onEdit,
  onDelete,
}: ProductCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.access_token);
  const [commentText, setCommentText] = useState("");
  const [replyToComment, setReplyToComment] = useState<ProductComment | null>(
    null,
  );
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const { data: serverComments } = useProductComments(product.id);
  const createCommentMutation = useCreateProductComment();
  const createReportMutation = useCreateProductReport();

  const displayedComments = useMemo(
    () => serverComments ?? product.comments ?? [],
    [product.comments, serverComments],
  );
  const commentTree = useMemo(
    () => buildCommentTree(displayedComments),
    [displayedComments],
  );
  const totalCommentCount = useMemo(
    () => countCommentTree(commentTree),
    [commentTree],
  );

  const mainImage = useMemo(() => {
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return undefined;
  }, [product.imageUrls]);

  const goToLogin = () => {
    window.scrollTo(0, 0);
    navigate("/login", { state: { from: location } });
  };

  const requireAuth = () => {
    if (!accessToken) {
      goToLogin();
      return false;
    }
    return true;
  };

  const handleCommentSubmit = () => {
    if (!requireAuth()) return;

    const content = commentText.trim();
    if (!content) return;
    const payload = {
      productId: product.id,
      content,
      parentCommentId: replyToComment?.commentId,
    };
    createCommentMutation.mutate(payload, {
      onSuccess: () => {
        setCommentText("");
        setReplyToComment(null);
      },
      onError: () => {
        setReplyToComment(null);
      },
    });
  };

  const handleOpenComments = () => {
    if (!requireAuth()) return;
    setIsCommentsOpen(true);
  };

  const handleOpenReport = () => {
    if (!requireAuth()) return;
    setIsReportOpen(true);
    setIsActionOpen(false);
  };

  const handleReportSubmit = () => {
    if (!requireAuth()) return;

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

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsActionOpen((prev) => !prev)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {isActionOpen && (
                <div className="absolute right-0 top-10 z-20 min-w-32 rounded-xl border bg-background p-1.5 shadow-lg">
                  {mode === "owner" ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-full justify-start rounded-lg text-sm hover:bg-muted"
                        onClick={() => {
                          onEdit?.(product);
                          setIsActionOpen(false);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-full justify-start rounded-lg text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          onDelete?.(product);
                          setIsActionOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 w-full justify-start rounded-lg text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      onClick={handleOpenReport}
                    >
                      Report
                    </Button>
                  )}
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

        <Separator />

        <CardContent className="flex flex-col gap-3 bg-muted/30 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {product.videoUrls && product.videoUrls.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                <Eye className="h-3 w-3" />
                Video
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
              <MessageCircle className="h-3 w-3" />
              {totalCommentCount} comments
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <Button
                size="sm"
                variant="secondary"
                className="w-full md:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                Add to cart
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full md:w-auto"
              onClick={handleOpenComments}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              {totalCommentCount > 0
                ? `Comments (${totalCommentCount})`
                : "View comments"}
            </Button>
          </div>
        </CardContent>
        {/* Comments Preview */}
        {commentTree.length > 0 && (
          <CardContent className="space-y-3 bg-muted/10 pt-4">
            {commentTree.slice(0, 2).map((node) => {
              const displayName = node.displayName ?? node.userName ?? "User";
              return (
                <div
                  key={node.id}
                  className="rounded-lg border border-border/50 bg-background p-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 shrink-0 border">
                      <AvatarFallback>
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-sm">
                        {displayName}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {node.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {commentTree.length > 2 && (
              <p className="text-xs text-muted-foreground text-center">
                +{commentTree.length - 2} more comment
                {commentTree.length - 2 > 1 ? "s" : ""}
              </p>
            )}
          </CardContent>
        )}
      </Card>

      {isCommentsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            setIsCommentsOpen(false);
            setReplyToComment(null);
          }}
        >
          <div
            className="flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hidden min-h-0 flex-1 flex-col border-r bg-muted/20 md:flex">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">Product preview</p>
                  <p className="text-xs text-muted-foreground">
                    {product.title}
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

              <div className="min-h-0 flex-1 overflow-auto">
                <div className="aspect-square w-full bg-muted">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border">
                      <AvatarImage
                        src={product.sellerProfilePicture}
                        alt={
                          product.sellerUserName ??
                          product.sellerFullName ??
                          "Seller"
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

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={conditionVariant[product.condition] ?? "outline"}
                    >
                      {product.condition}
                    </Badge>
                    <Badge variant="secondary">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{product.title}</p>
                    {product.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 w-full flex-col md:max-w-130">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">Comments</p>
                  <p className="text-xs text-muted-foreground">
                    {totalCommentCount} comments
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

              <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
                {commentTree.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to comment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {commentTree.map((node) => (
                      <CommentThreadNode
                        key={node.id}
                        node={node}
                        onReply={(comment) => {
                          setReplyToComment(comment);
                          setIsCommentsOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t bg-background px-5 py-4">
                {replyToComment && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border bg-muted/30 px-3 py-2 text-xs">
                    <span className="truncate text-muted-foreground">
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
                      Cancel
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      replyToComment
                        ? `Reply to ${replyToComment.displayName ?? replyToComment.userName ?? "user"}...`
                        : "Add a comment..."
                    }
                    rows={3}
                    className="min-h-24 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {replyToComment
                        ? "Your reply will appear under the selected comment."
                        : "Share your thoughts about this product."}
                    </p>

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCommentSubmit}
                      disabled={
                        createCommentMutation.isPending || !commentText.trim()
                      }
                    >
                      {replyToComment ? "Reply" : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode !== "owner" && isReportOpen && (
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
