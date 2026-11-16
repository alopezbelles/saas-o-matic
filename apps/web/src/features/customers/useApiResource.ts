import { useEffect, useState } from 'react';

type ResourceState<T> =
  | { key: string; status: 'loading' }
  | { key: string; status: 'success'; value: T }
  | { key: string; status: 'error'; error: unknown };

export function useApiResource<T>(
  resourceKey: string,
  load: ((signal: AbortSignal) => Promise<T>) | null,
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ResourceState<T>>({
    key: '',
    status: 'loading',
  });
  const key = JSON.stringify([resourceKey, attempt]);
  useEffect(() => {
    if (!load) return;
    const controller = new AbortController();
    let active = true;
    void load(controller.signal).then(
      (value) => {
        if (active) setState({ key, status: 'success', value });
      },
      (error: unknown) => {
        if (active) setState({ key, status: 'error', error });
      },
    );
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, load]);
  const current: ResourceState<T> =
    state.key === key ? state : { key, status: 'loading' };
  return {
    state: current,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
