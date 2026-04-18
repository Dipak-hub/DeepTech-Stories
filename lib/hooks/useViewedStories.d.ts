export declare function useViewedStories(initialIds?: string[]): {
    viewedIds: string[];
    markViewed: (id: string) => void;
    isViewed: (id: string) => boolean;
    isUserFullyViewed: (storyIds: string[]) => boolean;
};
