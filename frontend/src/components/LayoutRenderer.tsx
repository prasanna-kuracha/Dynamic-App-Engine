'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { NavigationSchema } from '@/shared/schema';
import { z } from 'zod';

type Navigation = z.infer<typeof NavigationSchema>;

interface LayoutRendererProps {
  appName: string;
  navigation: Navigation[];
  children: React.ReactNode;
  currentPath?: string;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ appName, navigation, children, currentPath = '/' }) => {
  return (
    <div className="flex h-screen bg-[#FDFCFE] dark:bg-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#EEF2FF] to-[#F5F3FF] dark:bg-gray-800 border-r border-indigo-50 dark:border-gray-700 shadow-2xl shadow-indigo-100/20 flex flex-col h-screen">
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Icons.Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-indigo-900 dark:text-white tracking-tight">{appName}</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 ml-1">Dynamic App Engine</p>
        </div>
        
        <nav className="mt-10 px-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const IconComponent = (Icons as any)[item.icon || 'Circle'];
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50 transform scale-[1.02]' 
                    : 'text-indigo-400 hover:bg-white/50 hover:text-indigo-600'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'bg-transparent group-hover:bg-indigo-50 text-indigo-400 group-hover:text-indigo-500'}`}>
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
                <span className="ml-4 font-black text-base tracking-wide">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="p-8 flex-shrink-0">
          <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl text-white shadow-xl shadow-indigo-200 overflow-hidden group relative">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-xl transition-transform group-hover:scale-150"></div>
             <p className="text-xs font-bold opacity-80 mb-1">Status</p>
             <p className="text-sm font-black">All Systems Online</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col bg-gradient-to-br from-white to-[#F5F7FF]">
        <header className="h-20 flex-shrink-0 bg-white/50 backdrop-blur-md border-b border-indigo-50 dark:border-gray-700 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Current View</span>
            <span className="text-gray-300 mx-2 text-lg">/</span>
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-200 capitalize tracking-tight">
              {currentPath === '/' ? 'Dashboard Overview' : currentPath.replace('/', '')}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-gradient-to-tr from-pink-200 to-indigo-200 rounded-full border-2 border-white shadow-md"></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
