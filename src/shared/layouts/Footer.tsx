import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Về Juratifact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary">Giới thiệu</Link></li>
              <li><Link to="#" className="hover:text-primary">Quy chế hoạt động</Link></li>
              <li><Link to="#" className="hover:text-primary">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="hover:text-primary">An toàn mua bán</Link></li>
              <li><Link to="#" className="hover:text-primary">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Danh mục</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary">Đồ điện tử</Link></li>
              <li><Link to="#" className="hover:text-primary">Thời trang</Link></li>
              <li><Link to="#" className="hover:text-primary">Nội thất</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Tải ứng dụng</h4>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">Google Play</Button>
              <Button variant="outline" size="sm">App Store</Button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Juratifact. Mua bán đồ cũ bền vững.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;