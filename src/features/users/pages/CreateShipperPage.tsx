import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ShipperForm } from "../components/ShipperForm";
import { useCreateShipper } from "../hooks/useUsers";
import type { CreateShipperFormData } from "../schema";

export default function CreateShipperPage() {
  const navigate = useNavigate();
  const createShipperMutation = useCreateShipper();

  const handleSubmit = (data: CreateShipperFormData) => {
    createShipperMutation.mutate(data, {
      onSuccess: () => {
        navigate("/admin/users");
      },
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-6 flex flex-col items-center">
      <div className="mb-6 w-full text-center">
        <div className="flex justify-start mb-4">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-orange-500">
          TẠO TÀI KHOẢN SHIPPER
        </h1>
        <p className="text-muted-foreground">
          Thêm một nhân viên vận chuyển mới vào hệ thống.
        </p>
      </div>

      <Card className="w-full rounded-2xl border-none shadow-xl">
        <CardHeader>
          <CardTitle>Thông tin shipper</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipperForm
            onSubmit={handleSubmit}
            isPending={createShipperMutation.isPending}
            onCancel={() => navigate("/admin/users")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
