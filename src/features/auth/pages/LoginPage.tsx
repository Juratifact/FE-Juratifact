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
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}