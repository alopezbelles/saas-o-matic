import { useEffect, useRef } from 'react';

/** Restore focus when an explicitly activated paging/retry control was removed. */
export function useQueryFocus(key: string, status: string, headingId: string) {
  const requested = useRef(false);
  useEffect(() => {
    if (!requested.current || status === 'loading') return;
    requested.current = false;
    // A user may have focused another control while the request was pending.
    if (document.activeElement === document.body) {
      document.getElementById(headingId)?.focus();
    }
  }, [key, status, headingId]);
  return () => {
    requested.current = true;
  };
}
