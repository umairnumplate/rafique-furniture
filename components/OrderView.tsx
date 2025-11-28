import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TrashIcon from './icons/TrashIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import type { OrderLine } from '../types';
import type { View } from '../App';

interface OrderViewProps {
  navigateTo: (view: View) => void;
}

const OrderView: React.FC<OrderViewProps> = ({ navigateTo }) => {
  const { state, dispatch } = useAppContext();
  const { currentOrder } = state;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [customItem, setCustomItem] = useState({ name: '', quantity: 1, price: '', note: ''});


  const isEditing = state.isEditingOrder;

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_CUSTOMER_DETAILS',
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleLineItemChange = (lineId: string, updates: Partial<OrderLine>) => {
      dispatch({
        type: 'UPDATE_ORDER_LINE_DETAILS',
        payload: { lineId, ...updates },
      });
  };

  const handleRemove = (lineId: string) => {
    dispatch({ type: 'REMOVE_ORDER_LINE', payload: lineId });
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
      setTimeout(() => {
        setShowConfirmation(false);
        navigateTo('HISTORY');
      }, 2000);
  }
  
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (customItem.name && customItem.quantity > 0 && Number(customItem.price) > 0) {
        dispatch({
            type: 'ADD_CUSTOM_ITEM_TO_ORDER',
            payload: {
                name: customItem.name,
                quantity: Number(customItem.quantity),
                price: Number(customItem.price),
                note: customItem.note,
            }
        });
        setCustomItem({ name: '', quantity: 1, price: '', note: '' });
    } else {
        alert('Please enter a valid name, quantity, and price for the custom item.');
    }
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount && paymentAmount > 0) {
        dispatch({ type: 'ADD_PAYMENT', payload: Number(paymentAmount) });
        setPaymentAmount('');
    } else {
        alert('Please enter a valid payment amount.');
    }
  };

  const handleRemovePayment = (paymentId: string) => {
    if(window.confirm('Are you sure you want to remove this payment?')) {
        dispatch({ type: 'REMOVE_PAYMENT', payload: paymentId });
    }
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
        message += `${index + 1}) ${item.name} (x${item.quantity})\n`;
        message += `   Price: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}\n`;
        if (item.note) {
            message += `   Note: ${item.note}\n`;
        }
        message += '\n';
    });
    message += "-------------------------------\n";
    message += `Total Amount: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.total)}\n`;
    message += `Amount Paid: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.paidAmount)}\n`;
    message += `Balance Due: ${new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.balanceDue)}\n\n`;

    message += `Customer: ${currentOrder.customerName}\n`;
    message += `Phone: ${currentOrder.customerPhone}\n`;
    if (currentOrder.customerAddress) {
        message += `Address: ${currentOrder.customerAddress}\n`;
    }
    if (currentOrder.notes) {
        message += `Notes: ${currentOrder.notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-dark-primary">{isEditing ? 'Edit Order' : 'New Customer Order'}</h2>

      {showConfirmation && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md fixed top-20 right-4 z-20" role="alert">
          <p className="font-bold">Success</p>
          <p>Order has been {isEditing ? 'updated' : 'saved'} successfully!</p>
        </div>
      )}

      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="customerName" placeholder="Customer Name*" value={currentOrder.customerName} onChange={handleCustomerDetailsChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          <input type="tel" name="customerPhone" placeholder="Phone (for WhatsApp)*" value={currentOrder.customerPhone} onChange={handleCustomerDetailsChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          <input type="text" name="customerAddress" placeholder="Address (Optional)" value={currentOrder.customerAddress} onChange={handleCustomerDetailsChange} className="p-2 border rounded md:col-span-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          <textarea name="notes" placeholder="Order Notes (Optional)" value={currentOrder.notes || ''} onChange={handleCustomerDetailsChange} className="p-2 border rounded md:col-span-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600" rows={3}></textarea>
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Add Other Item</h3>
        <form onSubmit={handleAddCustomItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Item Name" value={customItem.name} onChange={e => setCustomItem({...customItem, name: e.target.value})} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
            <div className="flex gap-2">
                <input type="number" placeholder="Qty" value={customItem.quantity} onChange={e => setCustomItem({...customItem, quantity: Number(e.target.value)})} className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
                <input type="number" placeholder="Price" value={customItem.price} onChange={e => setCustomItem({...customItem, price: e.target.value})} className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <input type="text" placeholder="Note (Optional)" value={customItem.note} onChange={e => setCustomItem({...customItem, note: e.target.value})} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 md:col-span-2"/>
            <button type="submit" className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 md:col-span-1">Add Item</button>
        </form>
      </div>

      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Payments</h3>
        <form onSubmit={handleAddPayment} className="flex items-center gap-2 mb-4">
            <input type="number" placeholder="Enter amount" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
            <button type="submit" className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Add Payment</button>
        </form>
        <div className="space-y-2">
            {currentOrder.payments.map(payment => (
                <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <div>
                        <span className="font-semibold">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(payment.amount)}</span>
                        <span className="text-xs text-gray-500 ml-2">{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => handleRemovePayment(payment.id)} className="p-1 text-red-500 hover:text-red-700">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
            ))}
             {currentOrder.payments.length === 0 && <p className="text-center text-sm text-gray-500">No payments added yet.</p>}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Selected Items</h3>
        {currentOrder.orderLines.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No items selected. Browse categories to add products.</p>
        ) : (
          <div className="space-y-4">
            {currentOrder.orderLines.map((item: OrderLine) => (
              <div key={item.lineId} className="flex flex-col gap-3 p-3 border rounded-md dark:border-gray-700">
                <div className="flex items-start gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md"/>
                    <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Added: {new Date(item.addedAt).toLocaleDateString()}
                            {item.isAddedLater && <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">Added Later</span>}
                        </div>
                    </div>
                    <button onClick={() => handleRemove(item.lineId)} className="p-2 text-red-500 hover:text-red-700">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Qty:</label>
                        <input type="number" value={item.quantity} onChange={e => handleLineItemChange(item.lineId, { quantity: parseInt(e.target.value) || 0 })} className="w-16 p-1 border rounded text-center bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="text-sm">Price:</label>
                        <input type="number" value={item.price} onChange={e => handleLineItemChange(item.lineId, { price: parseInt(e.target.value) || 0 })} className="w-24 p-1 border rounded text-center bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <p className="sm:col-span-1 text-center sm:text-right font-semibold">
                        {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                    </p>
                </div>
                 <input
                    type="text"
                    placeholder="Add an item-specific note..."
                    value={item.note || ''}
                    onChange={e => handleLineItemChange(item.lineId, { note: e.target.value })}
                    className="w-full text-sm p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-16 md:bottom-auto md:relative mt-6 p-4 bg-white dark:bg-dark-surface rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg text-center md:text-left space-y-1">
            <div>
                <span className="font-semibold">Total: </span> 
                <span className="text-primary dark:text-dark-primary font-bold">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.total)}</span>
            </div>
            <div>
                <span className="font-semibold">Paid: </span> 
                <span className="text-green-600 font-bold">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.paidAmount)}</span>
            </div>
            <div>
                <span className="font-semibold">Balance: </span> 
                <span className="text-red-600 font-bold">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(currentOrder.balanceDue)}</span>
            </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleSaveOrder} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300">{isEditing ? 'Update Order' : 'Save Order'}</button>
          <button onClick={handleShareOnWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2">
            <WhatsAppIcon className="w-5 h-5"/> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
