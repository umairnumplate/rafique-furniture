
import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Category } from '../types';

interface ProductListProps {
  category: Category;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const { state, dispatch } = useAppContext();
  const products = state.products.filter((p) => p.categoryId === category.id);

  const handleAdd = (product) => {
    dispatch({ type: 'ADD_PRODUCT_TO_ORDER', payload: product });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-dark-primary">{category.name}</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No products found in this category.</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">{product.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-bold text-primary dark:text-dark-primary">
                  {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(product.basePrice)}
                </p>
                <button
                  onClick={() => handleAdd(product)}
                  className="bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-primary text-white dark:text-dark-onPrimary font-bold py-2 px-4 rounded transition duration-300"
                >
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ProductList;
