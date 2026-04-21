import { Search, Bell, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-8">
        
        {/* Left: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="size-10 bg-black rounded-sm flex items-center justify-center overflow-hidden">
              <img 
                src="src/shared/pictures/logo-lizard.png" 
                alt="Juratifact Admin" 
                className="size-7 invert object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic uppercase leading-none tracking-tighter">
                Juratifact
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Admin Panel
              </span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-6" />
          </Button>
        </div>

        {/* Center: Universal Search (Đồng bộ với UI chính) */}
        <div className="hidden md:flex flex-1 max-w-md mx-12">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm quản trị (Sản phẩm, Người dùng, Đơn hàng)..."
              className="w-full h-11 bg-muted/50 border-2 border-transparent focus:border-black focus:bg-background rounded-none pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted rounded-none">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background" />
          </Button>

          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-muted rounded-none transition-all">
                <div className="size-9 bg-black flex items-center justify-center text-white font-black italic text-sm">
                  AD
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-black uppercase italic">Administrator</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Super User</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border-2 border-black p-2">
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest opacity-50">Tài khoản quản lý</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-black focus:text-white rounded-none cursor-pointer py-3 text-xs font-black uppercase italic">
                <User className="mr-3 size-4" /> Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-black focus:text-white rounded-none cursor-pointer py-3 text-xs font-black uppercase italic">
                <Settings className="mr-3 size-4" /> Cài đặt hệ thống
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-red-600 focus:text-white rounded-none cursor-pointer py-3 text-xs font-black uppercase italic text-red-600">
                <LogOut className="mr-3 size-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}