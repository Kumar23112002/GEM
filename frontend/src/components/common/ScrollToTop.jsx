import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures that whenever the route, query parameters, or page changes,
 * the viewport immediately and smoothly resets to the top (0, 0).
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigating to an on-page anchor (e.g. #contact), scroll to that element
    if (hash) {
      const targetElement = document.getElementById(hash.replace('#', ''));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Scroll to top immediately
    resetScroll();

    // Also fire on animation frame and micro-delay to prevent browser from restoring bottom scroll
    const frameId = requestAnimationFrame(resetScroll);
    const timeoutId = setTimeout(resetScroll, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [pathname, search, hash]);

  return null;
}
