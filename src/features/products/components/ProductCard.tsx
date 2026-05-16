import { useMemo, useState } from "react";

import {
  Eye,
  MessageCircle,
  MoreHorizontal,
  ShoppingBag,
  Send,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Card,
  CardHeader,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  useCreateProductComment,
  useDeleteProductComment,
  useProductComments,
  useUpdateProductComment,
} from "../hooks/useProduct";
import { useCreateProductReport } from "@/features/reports/hooks/useReports";
import { cn } from "@/lib/utils";
import type { Product, ProductComment } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { useAuthStore } from "@/features/auth/store";

interface CommentNode extends ProductComment {
  children: CommentNode[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  mode?: "owner" | "buyer";
  userId?: string | null;
}

interface CommentThreadNodeProps {
  node: CommentNode;
  depth?: number;
  onReply: (comment: CommentNode) => void;
  currentUserId?: string;
  onEditStart?: (comment: CommentNode) => void;
  onDeleteStart?: (commentId: string) => void;
  isEditingId?: string;
  editContent?: string;
  onEditContentChange?: (content: string) => void;
  onEditSubmit?: () => void;
  isEditingLoading?: boolean;
}

// Removed unused conditionVariant

const countCommentTree = (nodes: CommentNode[]): number =>
  nodes.reduce((total, node) => total + 1 + countCommentTree(node.children), 0);

function CommentThreadNode({
  node,
  depth = 0,
  onReply,
  currentUserId,
  onEditStart,
  onDeleteStart,
  isEditingId,
  editContent,
  onEditContentChange,
  onEditSubmit,
  isEditingLoading,
}: CommentThreadNodeProps) {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayName = node.displayName ?? node.userName ?? "User";
  const hasReplies = node.children.length > 0;
  const isCommentOwner = currentUserId && node.userId === currentUserId;
  const isEditing = isEditingId === node.id;

  return (
    <div className={cn("group flex gap-3", depth > 0 && "ml-4 md:ml-10 mt-3")}>
      <Avatar className={cn(
        "shrink-0 border-2 border-background shadow-md ring-1 ring-muted/30 transition-transform hover:scale-110", 
        depth > 0 ? "h-6 w-6" : "h-9 w-9"
      )}>
        <AvatarFallback className="text-[10px] font-black bg-linear-to-br from-muted to-muted/50">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="relative w-fit max-w-full group/bubble">
          <div
            className={cn(
              "rounded-[1.25rem] px-4 py-2.5 text-sm transition-all duration-200 shadow-xs",
              isEditing 
                ? "w-full border-2 border-primary/30 bg-background ring-4 ring-primary/5" 
                : "bg-muted/50 hover:bg-muted/80 border border-transparent hover:border-border/50",
              depth > 0 && "rounded-[1rem]"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="truncate font-bold text-xs hover:underline cursor-pointer">{displayName}</span>
              {isCommentOwner && !isEditing && (
                <div className="relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                  {isMenuOpen && (
                    <div className="absolute right-0 top-6 z-20 min-w-28 rounded-xl border bg-background p-1.5 shadow-xl animate-in fade-in zoom-in duration-200">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-full justify-start gap-2 rounded-lg text-xs hover:bg-muted"
                        onClick={() => {
                          onEditStart?.(node);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-full justify-start gap-2 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          onDeleteStart?.(node.id);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editContent ?? ""}
                  onChange={(e) => onEditContentChange?.(e.target.value)}
                  className="min-h-[60px] w-full resize-none border-none bg-transparent p-0 text-sm focus:ring-0"
                  autoFocus
                />
                <div className="flex justify-end gap-2 border-t pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => onEditStart?.(node)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                    onClick={onEditSubmit}
                    disabled={isEditingLoading}
                  >
                    {isEditingLoading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {node.content}
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-4 px-3 text-[11px] font-black text-muted-foreground/60 tracking-tight">
            <button className="hover:text-primary transition-colors uppercase tracking-widest">Thích</button>
            <button 
                className="hover:text-primary transition-colors uppercase tracking-widest"
                onClick={() => onReply(node)}
            >
                Trả lời
            </button>
            <span className="font-medium opacity-50">
              {new Date(node.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {hasReplies && (
          <div className="mt-2 space-y-1">
            <button
                onClick={() => setIsRepliesOpen(!isRepliesOpen)}
                className="group/toggle flex items-center gap-3 px-2 py-1 text-[11px] font-black text-primary/70 hover:text-primary transition-all active:scale-95"
            >
                <div className="h-px w-6 bg-primary/20 group-hover/toggle:w-8 transition-all" />
                <div className="flex items-center gap-1.5">
                    {isRepliesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    <span>{isRepliesOpen ? "Ẩn phản hồi" : `Xem ${node.children.length} phản hồi`}</span>
                </div>
            </button>

            {isRepliesOpen && (
                <div className="mt-3 space-y-5 border-l-[1.5px] border-primary/10 pl-6 ml-3 animate-in slide-in-from-left-1 duration-300">
                    {node.children.map((child: CommentNode) => (
                    <CommentThreadNode
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                        onReply={onReply}
                        currentUserId={currentUserId}
                        onEditStart={onEditStart}
                        onDeleteStart={onDeleteStart}
                        isEditingId={isEditingId}
                        editContent={editContent}
                        onEditContentChange={onEditContentChange}
                        onEditSubmit={onEditSubmit}
                        isEditingLoading={isEditingLoading}
                    />
                    ))}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  mode = "buyer",
  userId,
}: ProductCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyToComment, setReplyToComment] = useState<CommentNode | null>(
    null,
  );
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isActionOpen, setIsActionOpen] = useState(false);

  const [isEditingCommentId, setIsEditingCommentId] = useState<string | null>(
    null,
  );
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const { data: commentsRaw = [] } = useProductComments(product.id);
  const comments = (commentsRaw as ProductComment[]) ?? [];
  const createCommentMutation = useCreateProductComment();
  const updateCommentMutation = useUpdateProductComment(product.id);
  const deleteCommentMutation = useDeleteProductComment(product.id);
  const createReportMutation = useCreateProductReport();

  const currentUserId = useAuthStore((state) => state.userId);
  const isOwner = mode === "owner" || (!!currentUserId && product.sellerId === currentUserId);

  const mediaList = useMemo(() => {
    const list: { type: "image" | "video"; url: string }[] = [];
    product.imageUrls?.forEach((url) => list.push({ type: "image", url }));
    product.videoUrls?.forEach((url) => list.push({ type: "video", url }));
    return list;
  }, [product.imageUrls, product.videoUrls]);

  const currentMedia = mediaList[currentMediaIndex];

  const commentTree = useMemo(() => {
    const map = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    comments.forEach((c: ProductComment) => {
      map.set(c.id, { ...c, children: [] });
    });

    comments.forEach((c: ProductComment) => {
      const node = map.get(c.id)!;
      if (c.parentCommentId && map.has(c.parentCommentId)) {
        map.get(c.parentCommentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [comments]);

  const totalCommentCount = useMemo(
    () => countCommentTree(commentTree),
    [commentTree],
  );

  const handleOpenPreview = () => {
    setIsCommentsOpen(true);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      {
        productId: product.id,
        content: commentText.trim(),
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

  const handleEditCommentStart = (comment: CommentNode) => {
    if (isEditingCommentId === comment.id) {
      setIsEditingCommentId(null);
      setEditingCommentContent("");
    } else {
      setIsEditingCommentId(comment.id);
      setEditingCommentContent(comment.content);
    }
  };

  const handleEditCommentSubmit = () => {
    if (!isEditingCommentId || !editingCommentContent.trim()) return;

    updateCommentMutation.mutate(
      {
        commentId: isEditingCommentId,
        data: { content: editingCommentContent.trim() },
      },
      {
        onSuccess: () => {
          setIsEditingCommentId(null);
          setEditingCommentContent("");
        },
      },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleOpenReport = () => {
    setIsReportOpen(true);
    setIsActionOpen(false);
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim()) return;

    createReportMutation.mutate(
      {
        productId: product.id,
        reason: reportReason.trim(),
        description: reportDescription.trim(),
      },
      {
        onSuccess: () => {
          setIsReportOpen(false);
          setReportReason("");
          setReportDescription("");
        },
      },
    );
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-none bg-background shadow-none transition-all md:rounded-xl md:border md:shadow-xs">
        <CardHeader className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-border">
                <AvatarImage src={product.sellerProfilePicture} />
                <AvatarFallback className="font-bold">
                  {(product.sellerFullName ?? "U").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-black leading-none hover:underline cursor-pointer">
                  {product.sellerFullName ?? product.sellerUserName ?? "User"}
                </span>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                   <span>{new Date(product.createdAt).toLocaleString("vi-VN", { 
                     day: '2-digit', 
                     month: '2-digit', 
                     year: 'numeric',
                     hour: '2-digit', 
                     minute: '2-digit' 
                   })}</span>
                   <span>•</span>
                   <Eye className="h-3 w-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
                {product.isPromoted && (
                    <Badge className="bg-linear-to-r from-amber-500 to-orange-600 border-none text-[10px] h-6 font-black text-white animate-pulse">
                        
                        NỔI BẬT
                    </Badge>
                )}
                <Badge variant="secondary" className="h-6 text-[10px] font-black uppercase tracking-wider">
                    {product.condition}
                </Badge>
                <div className="relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => setIsActionOpen(!isActionOpen)}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {isActionOpen && (
                        <div className="absolute right-0 top-10 z-20 min-w-40 rounded-xl border bg-background p-2 shadow-xl animate-in fade-in zoom-in duration-200">
                             {isOwner ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start gap-2 rounded-lg"
                                        onClick={() => { onEdit?.(product); setIsActionOpen(false); }}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Chỉnh sửa tin
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start gap-2 rounded-lg text-destructive hover:bg-destructive/10"
                                        onClick={() => { onDelete?.(product); setIsActionOpen(false); }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Xóa tin đăng
                                    </Button>
                                </>
                             ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start gap-2 rounded-lg text-orange-600"
                                    onClick={handleOpenReport}
                                >
                                    <Eye className="h-4 w-4" />
                                    Báo cáo vi phạm
                                </Button>
                             )}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </CardHeader>

        <div
          className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted"
          onClick={handleOpenPreview}
        >
          {mediaList.length > 0 ? (
            mediaList[currentMediaIndex].type === "image" ? (
              <img
                src={mediaList[currentMediaIndex].url}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative h-full w-full">
                <video
                  src={mediaList[currentMediaIndex].url}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/30">
                <Eye className="h-10 w-10 text-muted-foreground/20" />
            </div>
          )}

          {mediaList.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {mediaList.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentMediaIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/40",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-bold leading-tight line-clamp-1">{product.title}</h3>
                {product.description && (
                    <p className="text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-b py-1">
                <div className="text-lg font-black tracking-tighter text-primary">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                    }).format(product.price)}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {totalCommentCount} bình luận
                </div>
            </div>

            <div className="flex items-center gap-1">
                
                <Button 
                    variant="ghost" 
                    className="flex-1 gap-2 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg h-9 text-xs"
                    onClick={handleOpenPreview}
                >
                    <MessageCircle className="h-4 w-4" />
                    Bình luận
                </Button>
                {onAddToCart && !isOwner && (
                    <Button 
                        variant="ghost" 
                        className="flex-1 gap-2 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg h-9 text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Thêm vào giỏ
                    </Button>
                )}
            </div>
        </div>

        <Separator />
      </Card>

      {isCommentsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 md:p-4 backdrop-blur-sm"
          onClick={() => {
            setIsCommentsOpen(false);
            setReplyToComment(null);
          }}
        >
          <div
            className="flex h-full md:h-[92vh] w-full max-w-6xl overflow-hidden rounded-none md:rounded-3xl border bg-background shadow-2xl"
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
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <div className="relative aspect-square w-full bg-muted">
                  {currentMedia ? (
                    <>
                      {currentMedia.type === "image" ? (
                        <img
                          src={currentMedia.url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={currentMedia.url}
                          className="h-full w-full bg-black"
                          controls
                          autoPlay
                          playsInline
                        />
                      )}

                      {mediaList.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                            onClick={() =>
                              setCurrentMediaIndex((prev) =>
                                prev === 0 ? mediaList.length - 1 : prev - 1,
                              )
                            }
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
                            onClick={() =>
                              setCurrentMediaIndex((prev) =>
                                prev === mediaList.length - 1 ? 0 : prev + 1,
                              )
                            }
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border">
                      <AvatarImage src={product.sellerProfilePicture} />
                      <AvatarFallback>
                        {(product.sellerFullName ?? "U").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {product.sellerFullName ?? "Người bán"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.sellerUserName ? `@${product.sellerUserName}` : "@unknown"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{product.title}</p>
                    {product.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 w-full flex-col md:max-w-[480px]">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">Bình luận</p>
                  <p className="text-xs text-muted-foreground">
                    {totalCommentCount} bình luận
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsCommentsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
                {commentTree.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                    Chưa có bình luận nào. Hãy là người đầu tiên!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commentTree.map((node: CommentNode) => (
                      <CommentThreadNode
                        key={node.id}
                        node={node}
                        onReply={(comment) => setReplyToComment(comment)}
                        currentUserId={userId ?? undefined}
                        onEditStart={handleEditCommentStart}
                        onDeleteStart={handleDeleteComment}
                        isEditingId={isEditingCommentId ?? undefined}
                        editContent={editingCommentContent}
                        onEditContentChange={setEditingCommentContent}
                        onEditSubmit={handleEditCommentSubmit}
                        isEditingLoading={updateCommentMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t bg-background px-5 py-4">
                {replyToComment && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-primary/5 px-4 py-2 text-xs">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-primary font-bold">Đang trả lời {replyToComment.displayName}</span>
                        <span className="truncate text-muted-foreground max-w-[200px]">{replyToComment.content}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setReplyToComment(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 border">
                        <AvatarFallback className="text-[10px]">ME</AvatarFallback>
                    </Avatar>
                    <div className="relative flex-1">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="min-h-[44px] w-full resize-none rounded-2xl border bg-muted/30 px-4 py-2.5 text-sm focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            placeholder={replyToComment ? "Viết câu trả lời..." : "Viết bình luận công khai..."}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                        />
                        <div className="absolute right-2 bottom-2">
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className={cn(
                                    "h-8 w-8 rounded-full",
                                    commentText.trim() ? "text-primary" : "text-muted-foreground/30"
                                )}
                                onClick={handleCommentSubmit}
                                disabled={!commentText.trim() || createCommentMutation.isPending}
                            >
                                {createCommentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Báo cáo vi phạm</h3>
                <p className="text-xs text-muted-foreground">Hãy cho chúng tôi biết vấn đề bạn gặp phải.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsReportOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Lý do báo cáo"
                disabled={createReportMutation.isPending}
              />
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Mô tả chi tiết (không bắt buộc)"
                rows={4}
                disabled={createReportMutation.isPending}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReportOpen(false)}>Hủy</Button>
                <Button
                  onClick={handleReportSubmit}
                  disabled={createReportMutation.isPending || !reportReason.trim()}
                >
                  {createReportMutation.isPending ? "Đang gửi..." : "Gửi báo cáo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
