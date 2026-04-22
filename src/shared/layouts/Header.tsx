import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/shared/components/ui/navigation-menu-trigger-style";
import { Input } from "@/shared/components/ui/input";
import { Search, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { Button } from "@/shared/components/ui/button";

const Header = () => {
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === "admin";

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  // Pill Navigation Item Style
  const menuTriggerClass = cn(
    navigationMenuTriggerStyle(),
    "h-8 px-4 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 rounded-full bg-transparent hover:bg-muted/50 focus:bg-muted/50",
  );

  const activeClass = "bg-secondary/80 text-secondary-foreground shadow-sm";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-4 mt-4">
        {/* The Floating Container - Viên thuốc bay lơ lửng */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-6 rounded-full border border-border/40 bg-background/40 backdrop-blur-md p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          {/* LEFT: Pill Navigation Menu */}
          <nav className="hidden lg:flex items-center shrink-0">
            <div className="flex items-center gap-0 bg-muted/40 p-1.5 rounded-full border border-border/30">
              <NavigationMenu>
                <NavigationMenuList className="gap-0">
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
                        {isAdmin ? "Dashboard" : "Trang chủ"}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

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
                          Bản đồ
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

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
                          Cá nhân
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </nav>

          {/* CENTER: Logo & Juratifact - Centered */}
          <Link
            to="/"
            className="flex items-center gap-1 sm:gap-1.5 shrink-0 group hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="/juralogo.png"
              alt="Logo"
              className="size-10 sm:size-12 object-contain dark:invert"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground hidden md:block">
              Juratifact
            </span>
          </Link>

          {/* RIGHT: Search, Theme Toggle & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar - Siêu mỏng bo tròn hoàn toàn */}
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Tìm kiếm..."
                className="h-8 sm:h-9 w-40 sm:w-48 rounded-full border border-border/40 bg-muted/30 pl-9 text-xs sm:text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-all duration-300"
              />
            </div>

            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full h-8 sm:h-9 w-8 sm:w-9 p-0 hover:bg-muted/50 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Separator Line */}
            <div className="hidden sm:block w-px h-6 bg-border/40"></div>

            {/* Login/Logout Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {!token ? (
                <Button
                  asChild
                  className="rounded-full px-4 sm:px-6 h-8 sm:h-9 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  {token && !isAdmin && (
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-md"
                    >
                      <Link to="/post-product">Đăng tin</Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
                    onClick={() => logoutMutation.mutate()}
                  >
                    Đăng xuất
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
