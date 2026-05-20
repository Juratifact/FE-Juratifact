import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/shared/components/ui/navigation-menu-trigger-style";
import { Input } from "@/shared/components/ui/input";
import {
  Search,
  Moon,
  Sun,
  ShoppingBag,
  User,
  LogOut,
  Package,
  Fingerprint,
  LayoutGrid,
  Star,
  Wallet,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { Button } from "@/shared/components/ui/button";
import { useMyCart } from "@/features/cart/hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { NotificationPopover } from "@/features/notifications/components/NotificationPopover";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.access_token);
  const role = useAuthStore((state) => state.role);
  const isVerify = useAuthStore((state) => state.isVerify);
  const isLoggedIn = !!token && !!role;
  const isBackoffice = isLoggedIn && (role === "Admin" || role === "Shipper");
  const canSeeOrders = isBackoffice ? false : (isLoggedIn && isVerify);
  const isUnverified = isLoggedIn && !isVerify && role !== "Admin";
  const { data: cart } = useMyCart(isLoggedIn && !isBackoffice);
  const isProductsPage = location.pathname === "/products";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentTitleSearch =
    new URLSearchParams(location.search).get("title") ?? "";

  const applySearch = () => {
    const value = searchInputRef.current?.value.trim() ?? "";
    const params = isProductsPage
      ? new URLSearchParams(location.search)
      : new URLSearchParams();

    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }

    params.delete("page");
    navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  const menuTriggerClass = cn(
    navigationMenuTriggerStyle(),
    "h-8 px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 rounded-full bg-transparent hover:bg-muted/50 focus:bg-muted/50",
  );

  const activeClass =
    "!bg-secondary/80 text-secondary-foreground shadow-sm !rounded-full";
  const cartItemCount = cart?.items?.length ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 mt-2">
        <div className="flex items-center justify-between rounded-full border border-border/40 bg-background/40 backdrop-blur-md p-2 sm:p-3 shadow-md hover:shadow-lg transition-shadow duration-300 relative">
          {/* 1. LEFT: Navigation Menu */}
          <div className="flex items-center gap-2 justify-start shrink-0 min-w-0">
            <nav className="hidden lg:flex items-center shrink-0">
              {!isUnverified && (
                <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/30">
                  <NavigationMenu>
                    <NavigationMenuList className="gap-1">
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to={isBackoffice ? "/admin" : "/"}
                            className={cn(
                              menuTriggerClass,
                              (location.pathname === "/" ||
                                location.pathname.startsWith("/admin")) &&
                                activeClass,
                            )}
                          >
                            {isBackoffice ? "Bảng điều khiển" : "Trang chủ"}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>

                      {!isBackoffice && (
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

                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products"
                            className={cn(
                              menuTriggerClass,
                              location.pathname === "/products" && activeClass,
                            )}
                          >
                            Sản phẩm
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )}
            </nav>
            <div className="lg:hidden flex items-center">
              {!isUnverified && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={isBackoffice ? "/admin" : "/"}>
                        {isBackoffice ? "Bảng điều khiển" : "Trang chủ"}
                      </Link>
                    </DropdownMenuItem>
                    {!isBackoffice && (
                      <DropdownMenuItem asChild>
                        <Link to="/map">Bản đồ</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/products">Sản phẩm</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center shrink-0 group hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src="/juralogo.png"
                alt="Logo"
                className="size-10 sm:size-12 object-contain dark:invert ml-1"
              />
            </Link>
          </div>
          
          {/* 2. CENTER: Logo (Desktop Only) */}
          <div className="hidden lg:flex shrink-0 justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <Link
              to="/"
              className="flex items-center gap-0 shrink-0 group hover:opacity-80 transition-opacity duration-300 -space-x-4 pointer-events-auto"
            >
              <img
                src="/juralogo.png"
                alt="Logo"
                className="size-14 sm:size-16 object-contain dark:invert "
              />
              <span className="text-base sm:text-2xl font-bold tracking-tight text-foreground hidden md:block ">
                Juratifact
              </span>
            </Link>
          </div>

          {/* 3. RIGHT: Search, Theme & Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0 min-w-0">
            <div className="relative flex items-center max-w-[120px] sm:max-w-40 w-full">
              {!isUnverified && (
                <>
                  <Search className="absolute left-2.5 top-1/2 size-3 sm:size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    key={location.search}
                    ref={searchInputRef}
                    defaultValue={currentTitleSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applySearch();
                      }
                    }}
                    placeholder="Tìm..."
                    className="h-8 w-full rounded-full border border-border/40 bg-muted/30 pl-8 sm:pl-9 text-[10px] sm:text-xs placeholder:text-muted-foreground/60 focus-visible:ring-1 transition-all duration-300"
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0 hover:bg-muted/50 transition-colors duration-300"
              >
                <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              </Button>

              <div className="hidden sm:block w-px h-6 bg-border/40"></div>

              {isLoggedIn && (
                <>
                  <NotificationPopover />
                  <div className="hidden sm:block w-px h-6 bg-border/40"></div>
                </>
              )}

              {isLoggedIn && !isBackoffice && (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="relative rounded-full h-8 w-8 p-0 hover:bg-muted/50 transition-colors duration-300"
                  >
                    <Link to="/cart" aria-label="Cart">
                      <ShoppingBag className="size-4" />
                      {cartItemCount > 0 && (
                        <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-destructive-foreground">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                  <div className="hidden sm:block w-px h-6 bg-border/40"></div>
                </>
              )}

              <div className="flex items-center gap-1">
                {!token ? (
                  <Button
                    asChild
                    className="rounded-full px-4 h-8 text-xs font-semibold"
                  >
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full p-0"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="User" />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Hồ sơ</span>
                          </Link>
                        </DropdownMenuItem>
                        {!isBackoffice && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/my-products" className="flex items-center">
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                <span>Sản phẩm của tôi</span>
                              </Link>
                            </DropdownMenuItem>
                            {!isBackoffice && (
                              <DropdownMenuItem asChild>
                                <Link to="/promotions" className="flex items-center">
                                  <Star className="mr-2 h-4 w-4 text-amber-500" />
                                  <span>Gói ưu đãi</span>
                                </Link>
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {canSeeOrders && (
                          <DropdownMenuItem asChild>
                            <Link to="/orders" className="flex items-center">
                              <Package className="mr-2 h-4 w-4" />
                              <span>Đơn hàng</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {!isBackoffice && (
                          <DropdownMenuItem asChild>
                            <Link to="/identify" className="flex items-center">
                              <Fingerprint className="mr-2 h-4 w-4" />
                              <span>Xác minh</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {isLoggedIn && !isBackoffice && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to="/wallet" className="flex items-center">
                                <Wallet className="mr-2 h-4 w-4" />
                                <span>Quản lý ví</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => logoutMutation.mutate()}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
