import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useGetMyIdentifyDocument } from "@/features/identify/hooks/useIdentify";
import { toast } from "sonner";

export function VerificationPoller() {
  const access_token = useAuthStore((s) => s.access_token);
  const isVerify = useAuthStore((s) => s.isVerify);
  const role = useAuthStore((s) => s.role);
  const setIsVerify = useAuthStore((s) => s.setIsVerify);

  const shouldPoll = !!access_token && !!role && !isVerify && role !== "Admin";

  const { data: document } = useGetMyIdentifyDocument({
    refetchInterval: shouldPoll ? 5000 : false,
    enabled: shouldPoll,
  });

  useEffect(() => {
    if (shouldPoll && document && document.isVerify === true) {
      setIsVerify(true);
      toast.success("Tài khoản của bạn đã được xác minh!", {
        description: "Bây giờ bạn có thể sử dụng đầy đủ tính năng.",
      });
    }
  }, [document, shouldPoll, setIsVerify]);

  return null;
}
