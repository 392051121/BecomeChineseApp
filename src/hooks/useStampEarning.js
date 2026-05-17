import { useEffect, useRef, useCallback } from 'react';
import { earnStamp, calculateEngagementScore, STAMP_THRESHOLDS } from '../data/stamps';

/**
 * Hook to track user engagement on content and earn stamps
 * @param {string} type - Content type (city, food, dynasty, person)
 * @param {object} content - Content item being viewed
 * @param {boolean} isActive - Whether the content is currently being viewed
 * @returns {object} - Engagement tracking helpers
 */
export function useStampEarning(type, content, isActive = false) {
  const viewStartTime = useRef(null);
  const interactions = useRef(0);
  const hasEarnedStamp = useRef(false);
  const scrollDepth = useRef(0);

  // Reset when content changes
  useEffect(() => {
    viewStartTime.current = null;
    interactions.current = 0;
    hasEarnedStamp.current = false;
    scrollDepth.current = 0;
  }, [content?.id]);

  // Track view time
  useEffect(() => {
    if (isActive && content?.id) {
      viewStartTime.current = Date.now();

      return () => {
        if (viewStartTime.current && !hasEarnedStamp.current) {
          const viewTimeMs = Date.now() - viewStartTime.current;
          tryEarnStamp(viewTimeMs);
        }
      };
    }
  }, [isActive, content?.id]);

  // Try to earn stamp based on engagement
  const tryEarnStamp = useCallback(async (viewTimeMs = 0) => {
    if (!content?.id || hasEarnedStamp.current) return null;

    const engagementScore = calculateEngagementScore({
      viewTimeMs: viewTimeMs || (viewStartTime.current ? Date.now() - viewStartTime.current : 0),
      scrollDepth: scrollDepth.current,
      interactions: interactions.current,
      expanded: true, // If they're viewing detail, it's expanded
    });

    if (engagementScore >= STAMP_THRESHOLDS.DEEP_EXPLORE_SCORE) {
      const stamp = await earnStamp(type, content, {
        viewTimeMs,
        scrollDepth: scrollDepth.current,
        interactions: interactions.current,
        expanded: true,
      });

      if (stamp) {
        hasEarnedStamp.current = true;
        return stamp;
      }
    }

    return null;
  }, [type, content]);

  // Track interaction (tap, bookmark, share)
  const trackInteraction = useCallback(() => {
    interactions.current += 1;
  }, []);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth) => {
    scrollDepth.current = Math.max(scrollDepth.current, depth);
  }, []);

  // Force earn stamp (for explicit actions like bookmarking)
  const forceEarnStamp = useCallback(async () => {
    if (!content?.id) return null;

    // Add interaction for this action
    interactions.current += 1;

    const stamp = await earnStamp(type, content, {
      viewTimeMs: viewStartTime.current ? Date.now() - viewStartTime.current : 5000,
      scrollDepth: scrollDepth.current,
      interactions: interactions.current,
      expanded: true,
    });

    if (stamp) {
      hasEarnedStamp.current = true;
    }

    return stamp;
  }, [type, content]);

  return {
    trackInteraction,
    trackScrollDepth,
    tryEarnStamp,
    forceEarnStamp,
    interactionCount: interactions.current,
  };
}
