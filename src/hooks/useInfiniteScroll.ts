import { useState, useEffect, useRef, useCallback } from "react";

export const useInfiniteScroll = <T,>(items: T[], itemsPerPage = 9) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
    setDisplayedItems(items.slice(0, itemsPerPage));
    setHasMore(items.length > itemsPerPage);
  }, [items, itemsPerPage]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = items.slice(0, endIndex);

    setDisplayedItems(newItems);
    setPage(nextPage);
    setHasMore(endIndex < items.length);
  }, [items, page, itemsPerPage]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loadMore]);

  return { displayedItems, hasMore, loadMoreRef };
};
