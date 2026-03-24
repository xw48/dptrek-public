import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { initSession } from './supabaseClient';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // Text size
  const [textSize, setTextSize] = useState(() => {
    return Cookies.get('dptrek_textsize') || 'medium';
  });

  // High contrast
  const [highContrast, setHighContrast] = useState(() => {
    return Cookies.get('dptrek_contrast') === 'high';
  });

  // Completed modules
  const [completedModules, setCompletedModules] = useState(() => {
    const saved = Cookies.get('dptrek_progress');
    return saved ? JSON.parse(saved) : [];
  });

  // Save text size to cookie
  useEffect(() => {
    Cookies.set('dptrek_textsize', textSize, { expires: 365 });
  }, [textSize]);

  // Save contrast to cookie + toggle body class
  useEffect(() => {
    Cookies.set('dptrek_contrast', highContrast ? 'high' : 'normal', { expires: 365 });
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Save completed modules to cookie
  useEffect(() => {
    Cookies.set('dptrek_progress', JSON.stringify(completedModules), { expires: 365 });
  }, [completedModules]);

  // Init session once on app load
  useEffect(() => {
    initSession(textSize);
  }, []);

  // Text size scale — shared between Home and Module
  const textSizeScale = useMemo(() => {
    const scales = {
      small: {
        base: 'text-sm',
        heading: 'text-3xl md:text-4xl',
        subheading: 'text-xl md:text-2xl',
        cardTitle: 'text-xl',
        cardText: 'text-base',
        sectionTitle: 'text-2xl',
        large: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
        '3xl': 'text-2xl',
      },
      medium: {
        base: 'text-base',
        heading: 'text-4xl md:text-5xl',
        subheading: 'text-xl md:text-2xl',
        cardTitle: 'text-2xl',
        cardText: 'text-lg',
        sectionTitle: 'text-3xl',
        large: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
      },
      large: {
        base: 'text-lg',
        heading: 'text-5xl md:text-6xl',
        subheading: 'text-2xl md:text-3xl',
        cardTitle: 'text-3xl',
        cardText: 'text-xl',
        sectionTitle: 'text-4xl',
        large: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
        '3xl': 'text-4xl',
      },
    };
    return scales[textSize] || scales.medium;
  }, [textSize]);

  const toggleComplete = (id) => {
    setCompletedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const value = {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    completedModules,
    setCompletedModules,
    toggleComplete,
    textSizeScale,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}