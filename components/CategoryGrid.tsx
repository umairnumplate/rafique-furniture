
import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Category } from '../types';

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const { state } = useAppContext();
  const { categories } = state;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
          onClick={() => onCategorySelect(category)}
        >
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-center text-lg font-semibold p-2">{category.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
