import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { PRODUCT_CONDITIONS } from "@/shared/constants";
import { useInfiniteProducts } from "../hooks/useProduct";
import { ProductCard } from "../components/ProductCard";

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ITEM_HEIGHT = 560;
  const OVERSCAN = 4;
  const listRef = useRef<HTMLDivElement>(null);
  const [{ startIndex, endIndex }, setRange] = useState({
    startIndex: 0,
    endIndex: 10,
  });

  // Data hook - infinite query
  const {
    products,
    hasMore,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
  } = useInfiniteProducts();

  const { observerRef } = useInfinityScroll({
    hasMore,
    isLoading: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
    threshold: 0,
  });

  useEffect(() => {
    const updateVirtualRange = () => {
      const listTop =
        (listRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      const scrollWithinList = Math.max(0, window.scrollY - listTop);
      const viewportHeight = window.innerHeight;
      const visibleCount =
        Math.ceil(viewportHeight / ITEM_HEIGHT) + OVERSCAN * 2;
      const nextStart = Math.max(
        0,
        Math.floor(scrollWithinList / ITEM_HEIGHT) - OVERSCAN,
      );
      const nextEnd = Math.min(products.length, nextStart + visibleCount);

      setRange((prev) => {
        if (prev.startIndex === nextStart && prev.endIndex === nextEnd) {
          return prev;
        }
        return { startIndex: nextStart, endIndex: nextEnd };
      });
    };

    updateVirtualRange();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          updateVirtualRange();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [products.length]);

  const virtualItems = useMemo(
    () => products.slice(startIndex, endIndex),
    [products, startIndex, endIndex],
  );

  const paddingTop = startIndex * ITEM_HEIGHT;
  const paddingBottom = Math.max(0, (products.length - endIndex) * ITEM_HEIGHT);

  useEffect(() => {
    const nearEnd = endIndex >= products.length - 2;
    if (hasMore && nearEnd && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [endIndex, fetchNextPage, hasMore, isFetchingNextPage, products.length]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("condition");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("page");
    setSearchParams(params);
  };

  const hasActiveFilters =
    !!searchParams.get("condition") || !!searchParams.get("sortBy");

  const titleQuery = searchParams.get("title") || "";

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8 rounded-2xl border bg-linear-to-br from-background via-background to-secondary/30 p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Product Marketplace
        </h1>
        <p className="mt-2 text-muted-foreground md:text-base">
          Discover high-quality pre-owned items at the best prices.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 rounded-2xl border bg-background/80 p-4 shadow-xs backdrop-blur md:p-5">
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          {titleQuery && (
            <Badge variant="outline" className="gap-1">
              Search: {titleQuery}
            </Badge>
          )}

          {/* Condition filter */}
          <select
            value={searchParams.get("condition") || ""}
            onChange={(e) =>
              handleFilterChange("condition", e.target.value || undefined)
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All conditions</option>
            {PRODUCT_CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>

          {/* Sort filter */}
          <select
            value={`${searchParams.get("sortBy") || ""}:${searchParams.get("sortOrder") || ""}`}
            onChange={(e) =>
              (() => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                const params = new URLSearchParams(searchParams);

                if (sortBy) {
                  params.set("sortBy", sortBy);
                  params.set("sortOrder", sortOrder || "DESC");
                } else {
                  params.delete("sortBy");
                  params.delete("sortOrder");
                }

                params.delete("page");
                setSearchParams(params);
              })()
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Sort by</option>
            <option value="date:DESC">Newest</option>
            <option value="price:ASC">Price: low to high</option>
            <option value="price:DESC">Price: high to low</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          )}

          {/* Result count */}
          <Badge variant="secondary" className="ml-auto">
            {products.length} results
          </Badge>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load products. Please try again.
          </p>
        </div>
      )}

      {/* Loading initial */}
      {isLoading && !products.length ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !products.length ? (
        <EmptyState
          title="No products found"
          description="Try changing your search keyword or filters."
        />
      ) : (
        <>
          {/* Window virtualized list + infinite scroll (single page scrollbar) */}
          <div ref={listRef} className="space-y-4">
            <div style={{ paddingTop, paddingBottom }} className="space-y-4">
              {virtualItems.map((product, index) => (
                <div
                  key={product.id ?? `${startIndex}-${index}`}
                  className="mx-auto max-w-3xl"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Loading next page indicator */}
          {isFetchingNextPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more...
              </div>
            </div>
          )}

          {hasMore && !isFetchingNextPage && (
            <div
              ref={observerRef}
              className="mt-4 text-center text-xs text-muted-foreground"
            >
              Scroll down to load more products
            </div>
          )}

          {/* End of list message */}
          {!hasMore && products.length > 0 && (
            <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
              No more products
            </div>
          )}
        </>
      )}
    </div>
  );
}
