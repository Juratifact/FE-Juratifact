import { useState, useMemo } from "react";
import { 
  X, AlertCircle, User, Package, Phone, Mail, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Play
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { useReportDetail } from "../hooks/useReports";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { getStatusLabel } from "../types";

interface ReportDetailModalProps {
  reportId: string | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoadingAction?: boolean;
}

export function ReportDetailModal({
  reportId,
  onClose,
  onApprove,
  onReject,
  isLoadingAction,
}: ReportDetailModalProps) {
  const { report, isLoading } = useReportDetail(reportId || "");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const media = useMemo(() => {
    if (!report?.product) return [];
    
    const imgs = (report.product.imageUrl || [])
      .filter((url: string | null) => url && url.trim() !== "")
      .map((url: string | null) => ({ type: 'image' as const, url: url as string }));
      
    const vids = (report.product.video || [])
      .filter((url: string | null) => url && typeof url === 'string' && url.trim() !== "")
      .map((url: string | null) => ({ type: 'video' as const, url: url as string }));
      
    return [...imgs, ...vids];
  }, [report]);

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (!reportId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-background shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : !report ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Không tìm thấy thông tin báo cáo.</p>
            </div>
          ) : (
            <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
              {/* Header */}
              <div className="p-6 pb-4 border-b">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="rounded-md">
                    {getStatusLabel(report.status)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Mã báo cáo: {report.id.split("-")[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Chi tiết báo cáo vi phạm</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Reason & Description */}
                <section>
                  <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <AlertCircle className="size-5" />
                    <h4 className="font-bold uppercase text-xs tracking-wider text-foreground">Nội dung báo cáo</h4>
                  </div>
                  <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
                    <p className="font-semibold text-lg mb-1">{report.reason}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Info */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Package className="size-5" />
                      <h4 className="font-bold uppercase text-xs tracking-wider text-foreground">Sản phẩm bị báo cáo</h4>
                    </div>
                    
                    {report.product ? (
                      <div className="space-y-3">
                        {media.length > 0 && (
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border group">
                            {media[currentMediaIndex].type === 'image' ? (
                              <img 
                                src={media[currentMediaIndex].url} 
                                alt={report.product.title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <video 
                                src={media[currentMediaIndex].url} 
                                controls 
                                className="w-full h-full object-contain"
                              />
                            )}
                            
                            {media.length > 1 && (
                              <>
                                <button 
                                  onClick={handlePrevMedia}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                                >
                                  <ChevronLeft className="size-5" />
                                </button>
                                <button 
                                  onClick={handleNextMedia}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                                >
                                  <ChevronRight className="size-5" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                  {media.map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`size-1.5 rounded-full transition-all ${i === currentMediaIndex ? 'bg-white w-3' : 'bg-white/40'}`}
                                    />
                                  ))}
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/40 text-[10px] text-white font-bold">
                                  {currentMediaIndex + 1} / {media.length} {media[currentMediaIndex].type === 'video' && <Play className="inline size-2.5 ml-1" />}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-base leading-tight mb-1">{report.product.title}</p>
                          <p className="text-primary font-bold">{report.product.price?.toLocaleString()} đ</p>
                        </div>
                        
                        <Separator className="opacity-50" />
                        
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Người bán</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="size-3.5 text-muted-foreground" />
                              <span className="font-medium">{report.product.seller?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="size-3.5" />
                              <span>{report.product.seller?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Thông tin sản phẩm không khả dụng.</p>
                    )}
                  </section>

                  {/* Reporter Info */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500">
                      <User className="size-5" />
                      <h4 className="font-bold uppercase text-xs tracking-wider text-foreground">Người báo cáo</h4>
                    </div>
                    
                    <div className="rounded-2xl border p-4 space-y-4 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {report.reporter?.fullName?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-bold">{report.reporter?.fullName}</p>
                          <p className="text-xs text-muted-foreground">ID: {report.reporter?.id.split("-")[0]}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="size-4 text-muted-foreground" />
                          <span>{report.reporter?.email}</span>
                        </div>
                        {report.reporter?.phoneNumber && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>{report.reporter?.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-muted/30 border-t flex flex-col sm:flex-row gap-3">
                {report.status === 0 ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full h-11 font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                      onClick={() => onReject(report.id)}
                      disabled={isLoadingAction}
                    >
                      <XCircle className="mr-2 size-4" />
                      Từ chối báo cáo
                    </Button>
                    <Button
                      className="flex-1 rounded-full h-11 font-semibold shadow-lg shadow-primary/20"
                      onClick={() => onApprove(report.id)}
                      disabled={isLoadingAction}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Xác nhận vi phạm
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-full h-11 font-semibold"
                    onClick={onClose}
                  >
                    Đóng chi tiết
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
