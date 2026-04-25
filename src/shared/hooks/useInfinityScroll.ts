import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * useInfinityScroll - Intersection Observer Hook
 *
 * Tự động load thêm dữ liệu khi user scroll đến cuối list.
 *
 * Usage:
 * ```tsx
 * const { observerRef } = useInfinityScroll({
 *   hasMore: true,
 *   isLoading: false,
 *   onLoadMore: () => fetchNextPage()
 * });
 *
 * return <div ref={observerRef} />
 * ```
 *
 * How it works:
 * 1. Tạo 1 invisible div ở cuối list (ref)
 * 2. Dùng IntersectionObserver API để theo dõi div này
 * 3. Khi div vào viewport → call onLoadMore callback
 * 4. Component tự động fetch page tiếp theo
 */

interface UseInfinityScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number; // 0-1, default 0.1 (trigger khi 10% visible)
}

export function useInfinityScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
}: UseInfinityScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      // Nếu element hiện trong viewport + còn dữ liệu + không đang loading
      // → gọi callback load thêm
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    // Browser support check
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin: "100px", // Load 100px trước khi chạm cuối (better UX)
    });

    observer.observe(observerRef.current);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [handleObserver, threshold]);

  return { observerRef };
}

/**
 * useVirtualization - List virtualization hook
 *
 * Chỉ render items visible trong viewport → boost performance.
 * Especially useful cho infinity scroll lists với 1000+ items.
 *
 * Alternative: Dùng library react-window hoặc react-virtualized
 * nhưng hook này simple hơn cho basic use case.
 */

/**
 * useVirtualization - List virtualization hook (simplified version)
 *
 * For complex virtualization needs, use react-window library instead.
 * This hook is intended as documentation for the pattern.
 */

interface UseVirtualizationProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualizationProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const virtualItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  const paddingTop = startIndex * itemHeight;
  const paddingBottom = Math.max(0, (items.length - endIndex) * itemHeight);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    virtualItems,
    startIndex,
    endIndex,
    paddingTop,
    paddingBottom,
    totalHeight: items.length * itemHeight,
    onScroll,
  };
}
