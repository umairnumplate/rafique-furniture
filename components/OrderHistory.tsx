
import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Order } from '../types';
import type { View } from '../App';

interface OrderHistoryProps {
  navigateTo: (view: View) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ navigateTo }) => {
  const { state, dispatch } = useAppContext();
  const { savedOrders } = state;

  const handleDuplicateOrder = (order: Order) => {
    const duplicatedOrder = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customerName: `${order.customerName} (Copy)`,
    };
    dispatch({ type: 'LOAD_ORDER', payload: duplicatedOrder });
    navigateTo('ORDER');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-dark-primary">Order History</h2>
      {savedOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No saved orders yet.</p>
      ) : (
        <div className="space-y-4">
          {savedOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="font-bold text-lg">{order.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                      </p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-lg text-primary dark:text-dark-primary">
                      {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(order.total)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.orderLines.length} items</p>
                  </div>
              </div>
              <details className="mt-4">
                  <summary className="cursor-pointer text-primary dark:text-primary-light">View Details</summary>
                  <ul className="mt-2 text-sm space-y-1 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {order.orderLines.map(line => (
                          <li key={line.productId}>
                              {line.nameSnapshot} - {line.quantity} x {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(line.price)}
                          </li>
                      ))}
                  </ul>
              </details>
              <div className="mt-4 text-right">
                <button 
                  onClick={() => handleDuplicateOrder(order)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-1 px-3 rounded text-sm"
                >
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
