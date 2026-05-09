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
import { Search, Moon, Sun, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { Button } from "@/shared/components/ui/button";
import { useMyCart } from "@/features/cart/hooks/useCart";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.access_token);
  const role = useAuthStore((state) => state.role);
  const isBackoffice = role === "Admin" || role === "Shipper";
  const canSeeOrders = token && !isBackoffice;
  const { data: cart } = useMyCart();
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
        {/* SỬA THÀNH GRID 3 CỘT: Đảm bảo phần giữa luôn ở tâm */}
        <div className="grid grid-cols-3 items-center rounded-full border border-border/40 bg-background/40 backdrop-blur-md p-2 sm:p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
          {/* 1. LEFT: Navigation Menu */}
          <div className="flex justify-start">
            <nav className="hidden xl:flex items-center shrink-0">
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
                          {isBackoffice ? "Dashboard" : "Home"}
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
                            Map
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
                          Products
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    {canSeeOrders && (
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/orders"
                            className={cn(
                              menuTriggerClass,
                              location.pathname.startsWith("/orders") &&
                                activeClass,
                            )}
                          >
                            Orders
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
                            Profile
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    {token && !isBackoffice && (
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/identify"
                            className={cn(
                              menuTriggerClass,
                              location.pathname.startsWith("/identify") &&
                                activeClass,
                            )}
                          >
                            Identify
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </nav>
          </div>

          {/* 2. CENTER: Logo (Căn giữa tuyệt đối trong cột 2) */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-0 shrink-0 group hover:opacity-80 transition-opacity duration-300 -space-x-4"
            >
              <img
                src="/juralogo.png"
                alt="Logo"
                className="size-10 sm:size-12 object-contain dark:invert "
              />
              <span className="text-base sm:text-2xl font-bold tracking-tight text-foreground hidden md:block ">
                Juratifact
              </span>
            </Link>
          </div>

          {/* 3. RIGHT: Search, Theme & Actions */}
          <div className="flex items-center justify-end gap-2 min-w-0">
            {/* Search Bar (Thu nhỏ max-width để không lấn chiếm logo) */}
            <div className="relative hidden lg:flex items-center max-w-40 w-full">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                placeholder="Search..."
                className="h-8 w-full rounded-full border border-border/40 bg-muted/30 pl-9 text-xs placeholder:text-muted-foreground/60 focus-visible:ring-1 transition-all duration-300"
              />
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

              {token && !isBackoffice && (
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
                    <Link to="/login">Sign in</Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-1">
                    {token && !isBackoffice && (
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full h-8 px-3 text-xs font-medium whitespace-nowrap"
                      >
                        <Link to="/products/create">Post</Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-8 px-2 sm:px-3 text-xs text-destructive/80 hover:bg-destructive/10 hover:text-destructive whitespace-nowrap"
                      onClick={() => logoutMutation.mutate()}
                    >
                      Sign out
                    </Button>
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
