import React, { createContext, useContext } from 'react';
import { useMahavyomaConfig, fallbackConfig } from '@/hooks/useMahavyomaConfig';

interface RemoteConfigContextValue {
  config: typeof fallbackConfig;
  loading: boolean;
}

const RemoteConfigContext = createContext<RemoteConfigContextValue>({
  config: fallbackConfig,
  loading: true,
});

export function RemoteConfigProvider({ children }: { children: React.ReactNode }) {
  const { config, loading } = useMahavyomaConfig();

  return (
    <RemoteConfigContext.Provider value={{ config, loading }}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

export function useRemoteConfig(): RemoteConfigContextValue {
  return useContext(RemoteConfigContext);
}
