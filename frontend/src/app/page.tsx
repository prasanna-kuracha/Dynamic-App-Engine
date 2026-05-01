'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { fetchConfig } from '@/services/api';
import { AppConfig } from '@/shared/schema';
import { LayoutRenderer } from '@/components/LayoutRenderer';
import { ViewRenderer } from '@/components/ViewRenderer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginView } from '@/components/LoginView';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DynamicAppWrapper />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function DynamicAppWrapper() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .finally(() => setLoading(false));

    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading || authLoading) return <div className="p-8 text-center">Initializing Dynamic Runtime...</div>;
  if (!config) return <div className="p-8 text-center text-red-500">Failed to load configuration.</div>;

  // Check if auth is enabled and user is not logged in
  if (config.auth?.enabled && !user) {
    return <LoginView appName={config.appName} />;
  }

  // Find the views corresponding to the current path (for simplicity, we render all views currently)
  // In a real app, the config would map views to paths. Here we just render them all on the dashboard.
  // To simulate routing based on the user's request, we'll split them:
  // "/" -> form and table
  // "/tasks" -> just table

  return (
    <LayoutRenderer appName={config.appName} navigation={config.navigation} currentPath={currentPath}>
      <div className="space-y-8">
        {config.views
          .filter(view => {
             // Logic:
             // "/" (Dashboard) -> Only show the dashboard/analytics view.
             // "/tasks" (Tasks) -> Show the table and form.
             if (currentPath === '/') return view.type === 'dashboard';
             if (currentPath === '/tasks') return view.type === 'table' || view.type === 'form';
             return true; 
          })

          .map((view) => {
            const model = config.models.find(m => m.name === view.model);
            if (!model) return null;
            return <ViewRenderer key={view.id} view={view} model={model} />;
        })}
      </div>
    </LayoutRenderer>
  );
}
