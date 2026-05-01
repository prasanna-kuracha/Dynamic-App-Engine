'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { NavigationSchema } from '@/shared/schema';
import { z } from 'zod';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';


type Navigation = z.infer<typeof NavigationSchema>;

interface LayoutRendererProps {
  appName: string;
  navigation: Navigation[];
  children: React.ReactNode;
  currentPath?: string;
}

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50 dark:border-gray-700 hover:scale-105 transition-all relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <Icons.Moon className="w-5 h-5 text-indigo-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <Icons.Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

const ProfileSection = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-1.5 pr-4 bg-white dark:bg-gray-800 rounded-2xl border border-indigo-50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        <div className="w-9 h-9 bg-gradient-to-tr from-pink-300 to-indigo-300 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-inner">
          {user.email[0].toUpperCase()}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-[10px] font-black text-indigo-950 dark:text-white leading-none mb-0.5">{user.email.split('@')[0]}</p>
          <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-tighter">Verified User</p>
        </div>
        <Icons.ChevronDown className={`w-3 h-3 text-indigo-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-indigo-50 dark:border-gray-700 py-3 z-50 overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-indigo-50 dark:border-gray-700 mb-2">
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-xs font-black text-indigo-950 dark:text-white truncate">{user.email}</p>
            </div>
            
            <button className="w-full px-5 py-2.5 flex items-center space-x-3 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
              <Icons.User className="w-4 h-4" />
              <span className="text-xs font-black">My Profile</span>
            </button>
            <button className="w-full px-5 py-2.5 flex items-center space-x-3 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
              <Icons.Settings className="w-4 h-4" />
              <span className="text-xs font-black">Settings</span>
            </button>
            
            <div className="h-[1px] bg-indigo-50 dark:bg-gray-700 my-2"></div>
            
            <button 
              onClick={logout}
              className="w-full px-5 py-2.5 flex items-center space-x-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Icons.LogOut className="w-4 h-4" />
              <span className="text-xs font-black">Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ appName, navigation, children, currentPath = '/' }) => {
  return (
    <div className="flex h-screen bg-[#FDFCFE] dark:bg-gray-900 font-sans transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#EEF2FF] to-[#F5F3FF] dark:from-gray-800 dark:to-gray-900 border-r border-indigo-50 dark:border-gray-700 shadow-2xl shadow-indigo-100/20 flex flex-col h-screen">
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Icons.Cpu className="w-6 h-6 text-white" />
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
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-100/50 transform scale-[1.02]' 
                    : 'text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'bg-transparent group-hover:bg-indigo-50 dark:group-hover:bg-gray-600 text-indigo-400 group-hover:text-indigo-500'}`}>
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
      <main className="flex-1 h-screen overflow-hidden flex flex-col bg-gradient-to-br from-white to-[#F5F7FF] dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <header className="h-20 flex-shrink-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-b border-indigo-50 dark:border-gray-700 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Current View</span>
            <span className="text-gray-300 mx-2 text-lg">/</span>
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-200 capitalize tracking-tight">
              {currentPath === '/' ? 'Dashboard Overview' : currentPath.replace('/', '')}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
             <ThemeToggle />
             <ProfileSection />
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
