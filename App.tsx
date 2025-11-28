
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import ProductList from './components/ProductList';
import OrderView from './components/OrderView';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';
import type { Category } from './types';

export type View = 'HOME' | 'CATEGORY_PRODUCTS' | 'ORDER' | 'HISTORY' | 'ADMIN';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('CATEGORY_PRODUCTS');
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return <CategoryGrid onCategorySelect={handleCategorySelect} />;
      case 'CATEGORY_PRODUCTS':
        if (!selectedCategory) {
          setCurrentView('HOME');
          return null;
        }
        return <ProductList category={selectedCategory} />;
      case 'ORDER':
        return <OrderView />;
      case 'HISTORY':
        return <OrderHistory navigateTo={navigateTo}/>;
      case 'ADMIN':
        return <AdminPanel />;
      default:
        return <CategoryGrid onCategorySelect={handleCategorySelect} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col font-sans">
        <Header navigateTo={navigateTo} currentView={currentView} />
        <main className="flex-grow container mx-auto p-4">
          {renderContent()}
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
