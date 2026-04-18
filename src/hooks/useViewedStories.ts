import { useState, useCallback } from 'react';

export function useViewedStories(initialIds: string[] = []) {
  const [viewedIds, setViewedIds] = useState<Set<string>>(
    () => new Set(initialIds)
  );

  const markViewed = useCallback((id: string) => {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const isViewed = useCallback(
    (id: string) => viewedIds.has(id),
    [viewedIds]
  );

  const isUserFullyViewed = useCallback(
    (storyIds: string[]) => storyIds.length > 0 && storyIds.every((id) => viewedIds.has(id)),
    [viewedIds]
  );

  return { viewedIds: [...viewedIds], markViewed, isViewed, isUserFullyViewed };
}
