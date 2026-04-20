import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Search, ArrowLeft, Home } from "lucide-react"; // Thay Frown bằng Search cho hợp vibe bản đồ/tìm kiếm
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-linear-to-b from-background to-secondary/20 px-4">
      <div className="relative w-full max-w-lg">
        {/* Đổi các Blobs sang tông xám/primary để đồng bộ */}
        <div className="absolute inset-0 -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 -bottom-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative overflow-hidden border-t-4 border-t-primary shadow-xl bg-card/50 backdrop-blur">
          <div className="relative p-10 sm:p-14 text-center space-y-8">
            
            <div className="relative z-10 space-y-6">
              {/* 404 Text - Đổi sang font black giống logo */}
              <div className="space-y-2">
                <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-primary/20">
                  404
                </h1>
                <div className="flex items-center justify-center -mt-10 sm:-mt-12">
                   <div className="bg-background p-4 rounded-full shadow-md border">
                      <Search className="w-10 h-10 text-primary animate-pulse" />
                   </div>
                </div>
              </div>

              {/* Description - Việt hóa nội dung cho thân thiện */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight">Món đồ này không tồn tại!</h2>
                <p className="text-muted-foreground">
                  Có vẻ như trang bạn đang tìm kiếm đã bị "thanh lý" hoặc chưa từng tồn tại trên hệ thống <strong>Juratifact</strong>.
                </p>
              </div>

              {/* Actions - Đồng bộ style nút */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="flex-1 font-bold rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <Link to="/" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}