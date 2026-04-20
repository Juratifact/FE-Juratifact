import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/shared/components/ui/navigation-menu-trigger-style";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";

const Header = () => {
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  // Logic từ code mẫu của bạn
  const token = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === "admin";

  // Style đồng bộ theo ảnh bạn gửi
  const menuTriggerClass = cn(
    navigationMenuTriggerStyle(),
    "h-10 px-6 py-2 text-base font-bold transition-all rounded-xl bg-transparent hover:bg-gray-200 focus:bg-gray-200",
  );

  const activeClass = "underline decoration-2 underline-offset-4 bg-gray-200";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-primary shrink-0"
          >
            Juratifact
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm đồ cũ bạn cần..."
              className="h-10 rounded-full pl-9"
            />
          </div>

          <nav className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                {/* 1. Logic Home / Dashboard */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={isAdmin ? "/admin" : "/"}
                      className={cn(
                        menuTriggerClass,
                        (location.pathname === "/" ||
                          location.pathname.startsWith("/admin")) &&
                          activeClass,
                      )}
                    >
                      {isAdmin ? "Dashboard" : "Home"}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 2. Bản đồ (Chỉ hiện cho User bình thường) */}
                {!isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/map"
                        className={cn(
                          menuTriggerClass,
                          location.pathname === "/map" && activeClass,
                        )}
                      >
                        Map
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {/* 3. Profile (Khi đã login) */}
                {token && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/profile"
                        className={cn(
                          menuTriggerClass,
                          location.pathname === "/profile" && activeClass,
                        )}
                      >
                        Profile
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {/* 4. Login / Logout */}
                {!token ? (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/login"
                        className={cn(
                          menuTriggerClass,
                          location.pathname === "/login" && activeClass,
                        )}
                      >
                        Login
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <button
                      onClick={() => logoutMutation.mutate()}
                      className={cn(
                        menuTriggerClass,
                        "text-destructive hover:text-destructive",
                      )}
                    >
                      Logout
                    </button>
                  </NavigationMenuItem>
                )}

                {/* 5. Đăng bán (Chỉ user và đã login) */}
                {token && !isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/post-product"
                        className={cn(
                          menuTriggerClass,
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                          location.pathname === "/post-product" && activeClass,
                        )}
                      >
                        Post Product
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
