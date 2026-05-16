import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, Crown, ShieldCheck, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Cơ bản",
    price: "Miễn phí",
    features: ["Dashboard cơ bản", "Quản lý users", "Quản lý reports"],
  },
  {
    name: "Pro",
    price: "299k/tháng",
    features: ["Phân tích nâng cao", "Bộ lọc nâng cao", "Hỗ trợ ưu tiên"],
    featured: true,
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    features: ["SSO / phân quyền", "Báo cáo nâng cao", "Tùy biến riêng"],
  },
];

export default function AdminUpgradePage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-300 hover:bg-orange-500/20">
              Trung tâm nâng cấp
            </Badge>
            <h1 className="mt-4 text-3xl font-black italic uppercase tracking-tight sm:text-5xl">
              Nâng cấp
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Thiết kế theo tinh thần sàn thương mại: nổi bật, rõ lợi ích, nhiều
              điểm nhấn hành động.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Uptime
              </p>
              <p className="mt-1 text-2xl font-black">99.9%</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Công việc
              </p>
              <p className="mt-1 text-2xl font-black">24</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Cảnh báo
              </p>
              <p className="mt-1 text-2xl font-black">3</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-3xl border bg-white shadow-sm ${plan.featured ? "border-orange-200 ring-2 ring-orange-100" : "border-slate-200"}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black italic uppercase">
                    {plan.name}
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{plan.price}</p>
                </div>
                <div
                  className={`grid size-12 place-items-center rounded-2xl ${plan.featured ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-700"}`}
                >
                  {plan.featured ? (
                    <Crown className="size-5" />
                  ) : (
                    <ShieldCheck className="size-5" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>{feature}</span>
                </div>
              ))}
              <Button
                className={`mt-4 w-full rounded-2xl ${plan.featured ? "bg-linear-to-r from-orange-500 to-rose-500 text-white hover:opacity-95" : "bg-slate-950 text-white hover:bg-slate-800"}`}
              >
                <Sparkles className="mr-2 size-4" /> Chọn gói
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
