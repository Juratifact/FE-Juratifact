import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ShieldOff, ArrowLeft, LogIn } from "lucide-react"; // Thay ShieldAlert bằng ShieldOff cho nhẹ nhàng hơn
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-linear-to-b from-background to-secondary/20 px-4">
      <div className="relative w-full max-w-lg">
        {/* Gradient Blobs tông Primary/Gray */}
        <div className="absolute inset-0 -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 -bottom-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative overflow-hidden border-t-4 border-t-primary shadow-xl bg-card/50 backdrop-blur">
          <div className="relative p-10 sm:p-14 text-center space-y-8">
            
            <div className="relative z-10 space-y-6">
              {/* Icon Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                   <div className="bg-background p-6 rounded-2xl shadow-sm border-2 border-dashed border-primary/20">
                      <ShieldOff className="w-12 h-12 text-primary" />
                   </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tighter text-primary">
                  TRUY CẬP BỊ HẠN CHẾ
                </h1>
                <p className="text-muted-foreground">
                  Rất tiếc, bạn không có quyền xem khu vực này. Có thể bạn cần một tài khoản có đặc quyền cao hơn hoặc cần đăng nhập lại.
                </p>
              </div>

              {/* Actions - Đồng bộ nút rounded-xl */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link to="/" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full font-bold rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập
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