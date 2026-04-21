import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-linear-to-b from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-black tracking-tighter text-primary">
            Juratifact
          </CardTitle>
          <CardDescription className="text-base font-medium text-foreground">
            Chào mừng bạn quay trở lại!
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để tiếp tục mua bán đồ cũ minh bạch
          </p>
          <div className="mt-3 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 text-left">
            <p className="text-xs font-semibold text-primary">
              Tài khoản test Admin
            </p>
            <p className="text-xs text-muted-foreground">
              Email: admin@gmail.com
            </p>
            <p className="text-xs text-muted-foreground">Mật khẩu: 123456</p>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
