
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Order, Payment } from '../types';
import type { View } from '../App';
import WhatsAppIcon from './icons/WhatsAppIcon';

// FIX: Define the props interface for the component.
interface OrderHistoryProps {
  navigateTo: (view: View) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ navigateTo }) => {
  const { state, dispatch } = useAppContext();
  const { savedOrders } = state;
  const [addingPaymentTo, setAddingPaymentTo] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');


  const handleEditOrder = (order: Order) => {
    dispatch({ type: 'LOAD_ORDER', payload: {order: order, isEditing: true} });
    navigateTo('ORDER');
  }

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order permanently? This action cannot be undone.')) {
        dispatch({ type: 'DELETE_SAVED_ORDER', payload: orderId });
    }
  }

  const handleDuplicateOrder = (order: Order) => {
    const duplicatedOrder: Order = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customerName: `${order.customerName} (Copy)`,
        payments: [],
        paidAmount: 0,
        balanceDue: order.total,
        notes: `Duplicated from order ${order.id}.\n\nOriginal notes:\n${order.notes || ''}`
    };
    dispatch({ type: 'LOAD_ORDER', payload: {order: duplicatedOrder, isEditing: false} });
    navigateTo('ORDER');
  }
  
  const handleAddPaymentSubmit = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    if (paymentAmount && paymentAmount > 0) {
        dispatch({ type: 'ADD_PAYMENT_TO_SAVED_ORDER', payload: { orderId, amount: Number(paymentAmount) } });
        setPaymentAmount('');
        setAddingPaymentTo(null);
    } else {
        alert('Please enter a valid payment amount.');
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

  const handleShareOnWhatsApp = (order: Order) => {
    if (order.orderLines.length === 0) {
        alert("Cannot share an empty order.");
        return;
    }
    if (!order.customerPhone) {
        alert("This order doesn't have a customer phone number to share.");
        return;
    }

    let message = "Rafiq Furniture House – Customer Order\n\n";
    order.orderLines.forEach((item, index) => {
        message += `${index + 1}) ${item.name} (x${item.quantity})\n`;
        message += `   Price: ${formatCurrency(item.price * item.quantity)}\n`;
        if (item.note) {
            message += `   Note: ${item.note}\n`;
        }
        message += '\n';
    });
    message += "-------------------------------\n";
    message += `Total Amount: ${formatCurrency(order.total)}\n`;
    message += `Amount Paid: ${formatCurrency(order.paidAmount)}\n`;
    message += `Balance Due: ${formatCurrency(order.balanceDue)}\n\n`;

    message += `Customer: ${order.customerName}\n`;
    message += `Phone: ${order.customerPhone}\n`;
    if (order.customerAddress) {
        message += `Address: ${order.customerAddress}\n`;
    }
    if (order.notes) {
        message += `Notes: ${order.notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleExportOrders = () => alert("This would export all orders to an Excel/CSV file.");
  const handleImportOrders = () => alert("This would open a file dialog to import orders from an Excel/CSV file.");


  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-dark-primary">Order History</h2>

      <div className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Data Management</h3>
        <div className="flex flex-col md:flex-row gap-4">
            <button onClick={handleImportOrders} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Import Orders (Excel)</button>
            <button onClick={handleExportOrders} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Export All Orders (Excel)</button>
        </div>
      </div>
      
      {savedOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No saved orders yet.</p>
      ) : (
        <div className="space-y-4">
          {savedOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex-grow">
                      <p className="font-bold text-lg">{order.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                      </p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <div className="font-semibold">Total: <span className={`font-bold ${order.balanceDue <= 0 ? 'text-green-600' : 'text-primary dark:text-dark-primary'}`}>{formatCurrency(order.total)}</span></div>
                      <div className="font-semibold">Paid: <span className="font-bold text-green-600">{formatCurrency(order.paidAmount)}</span></div>
                      <div className="font-semibold">Balance: <span className={`font-bold ${order.balanceDue <= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(order.balanceDue)}</span></div>
                  </div>
              </div>

              {addingPaymentTo === order.id && (
                  <form onSubmit={(e) => handleAddPaymentSubmit(e, order.id)} className="mt-4 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <input type="number" placeholder="Enter amount" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600" autoFocus/>
                      <button type="submit" className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">Save</button>
                      <button type="button" onClick={() => setAddingPaymentTo(null)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded">Cancel</button>
                  </form>
              )}

              <details className="mt-4">
                  <summary className="cursor-pointer text-primary dark:text-primary-light font-medium">View Details</summary>
                  <div className="mt-2 text-sm space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {order.customerAddress && (
                        <div>
                            <h4 className="font-semibold">Address</h4>
                            <p>{order.customerAddress}</p>
                        </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Items ({order.orderLines.length})</h4>
                      <ul className="space-y-2">
                          {order.orderLines.map(line => (
                              <li key={line.lineId} className="pl-2 border-l-2 border-gray-100 dark:border-gray-600">
                                  {line.name} - {line.quantity} x {formatCurrency(line.price)} = <strong>{formatCurrency(line.price * line.quantity)}</strong>
                                  {line.isAddedLater && <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">Added Later</span>}
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Added: {new Date(line.addedAt).toLocaleDateString()}</div>
                                  {line.note && <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-1 rounded mt-1">Note: {line.note}</div>}
                              </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Payments ({order.payments.length})</h4>
                      {order.payments.length > 0 ? (
                        <ul className="space-y-1 list-disc list-inside">
                          {order.payments.map(payment => (
                            <li key={payment.id}>
                              {formatCurrency(payment.amount)} on {new Date(payment.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-gray-500 text-xs">No payments recorded.</p>}
                    </div>
                     {order.notes && (
                        <div>
                            <h4 className="font-semibold">Notes</h4>
                            <p className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-2 rounded-md">{order.notes}</p>
                        </div>
                    )}
                  </div>
              </details>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button 
                  onClick={() => handleShareOnWhatsApp(order)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors flex items-center gap-1"
                >
                  <WhatsAppIcon className="w-4 h-4"/> Share
                </button>
                <button 
                  onClick={() => setAddingPaymentTo(order.id)}
                  className="bg-secondary hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Add Payment
                </button>
                <button 
                  onClick={() => handleEditOrder(order)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                 <button 
                  onClick={() => handleDeleteOrder(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Delete
                </button>
                <button 
                  onClick={() => handleDuplicateOrder(order)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-1 px-3 rounded text-sm transition-colors"
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
