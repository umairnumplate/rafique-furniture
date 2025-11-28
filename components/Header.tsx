
import React from 'react';
import { useAppContext } from '../context/AppContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import type { View } from '../App';

interface HeaderProps {
  navigateTo: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ navigateTo, currentView }) => {
  const { state, dispatch } = useAppContext();
  const { theme, currentOrder } = state;
  const itemCount = currentOrder.orderLines.reduce((sum, item) => sum + item.quantity, 0);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const NavButton: React.FC<{ view: View; label: string; children?: React.ReactNode }> = ({ view, label, children }) => (
    <button
      onClick={() => navigateTo(view)}
      className={`px-3 py-2 text-sm md:text-base rounded-md font-medium transition-colors duration-200 ${
        currentView === view
          ? 'bg-primary dark:bg-dark-primary text-white dark:text-dark-onPrimary'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
      {children}
    </button>
  );

  return (
    <header className="bg-white dark:bg-dark-surface shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 
          className="text-lg md:text-2xl font-bold text-primary dark:text-dark-primary cursor-pointer"
          onClick={() => navigateTo('HOME')}
        >
          Rafiq Furniture House
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <NavButton view="HOME" label="Home" />
            <NavButton view="ORDER" label="Order">
                {itemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                    </span>
                )}
            </NavButton>
            <NavButton view="HISTORY" label="History" />
            <NavButton view="ADMIN" label="Admin" />
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-700" /> : <SunIcon className="h-5 w-5 text-yellow-400" />}
          </button>
        </div>
      </div>
      {/* Mobile navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-700 flex justify-around p-2">
         <NavButton view="HOME" label="Home" />
         <NavButton view="ORDER" label="Order">
              {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                  </span>
              )}
          </NavButton>
         <NavButton view="HISTORY" label="History" />
         <NavButton view="ADMIN" label="Admin" />
      </div>
    </header>
  );
};

export default Header;
