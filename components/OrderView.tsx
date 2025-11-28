
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TrashIcon from './icons/TrashIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import type { OrderLine } from '../types';

const OrderView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { currentOrder } = state;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_CUSTOMER_DETAILS',
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleLineItemChange = (productId: string, newQuantity: number, newPrice: number) => {
    if (newQuantity >= 0) {
      dispatch({
        type: 'UPDATE_ORDER_LINE',
        payload: { productId, quantity: newQuantity, price: newPrice },
      });
    }
  };

  const handleRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_ORDER_LINE', payload: productId });
  };
  
  const handleSaveOrder = () => {
      if (currentOrder.orderLines.length === 0) {
          alert("Cannot save an empty order.");
          return;
      }
      if (!currentOrder.customerName) {
          alert("Please enter customer name to save the order.");
          return;
      }
      dispatch({ type: 'SAVE_ORDER' });
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
  }

  const handleShareOnWhatsApp = () => {
    if (currentOrder.orderLines.length === 0) {
        alert("Cannot share an empty order.");
        return;
    }
    if (!currentOrder.customerPhone) {
        alert("Please enter a customer phone number to share.");
        return;
    }

    let message = "Rafiq Furniture House – Customer Order\n\n";
    currentOrder.orderLines.forEach((item, index) => {
        message += `${index + 1}) ${item.nameSnapshot} (x${item.quantity})\n`;
        message += `   Price: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}\n\n`;
    });
    message += "-------------------------------\n";
    message += `Total: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.total)}\n\n`;
    message += `Customer: ${currentOrder.customerName}\n`;
    message += `Phone: ${currentOrder.customerPhone}\n`;
    if (currentOrder.customerAddress) {
        message += `Address: ${currentOrder.customerAddress}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-dark-primary">Customer Order</h2>

      {showConfirmation && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md" role="alert">
          <p className="font-bold">Success</p>
          <p>Order has been saved successfully!</p>
        </div>
      )}

      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="customerName" placeholder="Customer Name*" value={currentOrder.customerName} onChange={handleCustomerDetailsChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          <input type="tel" name="customerPhone" placeholder="Phone (for WhatsApp)*" value={currentOrder.customerPhone} onChange={handleCustomerDetailsChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          <input type="text" name="customerAddress" placeholder="Address (Optional)" value={currentOrder.customerAddress} onChange={handleCustomerDetailsChange} className="p-2 border rounded md:col-span-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Selected Items</h3>
        {currentOrder.orderLines.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No items selected. Browse categories to add products.</p>
        ) : (
          <div className="space-y-4">
            {currentOrder.orderLines.map((item: OrderLine) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-4 p-2 border-b dark:border-gray-700">
                <img src={item.imageUrlSnapshot} alt={item.nameSnapshot} className="w-20 h-20 object-cover rounded-md"/>
                <div className="flex-grow text-center sm:text-left">
                  <p className="font-semibold">{item.nameSnapshot}</p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" value={item.quantity} onChange={e => handleLineItemChange(item.productId, parseInt(e.target.value) || 0, item.price)} className="w-16 p-1 border rounded text-center bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    <span className="text-gray-500">x</span>
                    <input type="number" value={item.price} onChange={e => handleLineItemChange(item.productId, item.quantity, parseInt(e.target.value) || 0)} className="w-24 p-1 border rounded text-center bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <p className="w-28 text-center sm:text-right font-semibold">
                  {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                </p>
                <button onClick={() => handleRemove(item.productId)} className="p-2 text-red-500 hover:text-red-700">
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-16 md:bottom-auto md:relative mt-6 p-4 bg-white dark:bg-dark-surface rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-4 md:mb-0">
          Total: <span className="text-primary dark:text-dark-primary">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.total)}</span>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleSaveOrder} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300">Save Order</button>
          <button onClick={handleShareOnWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2">
            <WhatsAppIcon className="w-5 h-5"/> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
