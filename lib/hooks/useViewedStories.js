"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViewedStories = useViewedStories;
const react_1 = require("react");
function useViewedStories(initialIds = []) {
    const [viewedIds, setViewedIds] = (0, react_1.useState)(() => new Set(initialIds));
    const markViewed = (0, react_1.useCallback)((id) => {
        setViewedIds((prev) => {
            if (prev.has(id))
                return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);
    const isViewed = (0, react_1.useCallback)((id) => viewedIds.has(id), [viewedIds]);
    const isUserFullyViewed = (0, react_1.useCallback)((storyIds) => storyIds.length > 0 && storyIds.every((id) => viewedIds.has(id)), [viewedIds]);
    return { viewedIds: [...viewedIds], markViewed, isViewed, isUserFullyViewed };
}
