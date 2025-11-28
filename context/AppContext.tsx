import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, Category, Order, OrderLine, Payment } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface AppState {
  products: Product[];
  categories: Category[];
  currentOrder: Order;
  savedOrders: Order[];
  theme: Theme;
  isEditingOrder: boolean; // To track if we are editing a saved order
}

type Action =
  | { type: 'ADD_PRODUCT_TO_ORDER'; payload: Product }
  | { type: 'ADD_CUSTOM_ITEM_TO_ORDER'; payload: { name: string; quantity: number; price: number; note?: string } }
  | { type: 'UPDATE_ORDER_LINE_DETAILS'; payload: { lineId: string; quantity?: number; price?: number; note?: string } }
  | { type: 'REMOVE_ORDER_LINE'; payload: string } // payload is lineId
  | { type: 'UPDATE_CUSTOMER_DETAILS'; payload: { name: string; value: string } }
  | { type: 'ADD_PAYMENT_TO_SAVED_ORDER'; payload: { orderId: string; amount: number } }
  | { type: 'ADD_PAYMENT'; payload: number }
  | { type: 'REMOVE_PAYMENT'; payload: string }
  | { type: 'SAVE_ORDER' }
  | { type: 'DELETE_SAVED_ORDER'; payload: string }
  | { type: 'CLEAR_ORDER' }
  | { type: 'LOAD_ORDER'; payload: { order: Order; isEditing: boolean } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string };


const getInitialOrder = (): Order => ({
  id: `order-${Date.now()}`,
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  orderLines: [],
  payments: [],
  total: 0,
  paidAmount: 0,
  balanceDue: 0,
  createdAt: new Date().toISOString(),
  notes: '',
});

const recalculateOrderFinancials = (order: Order): Order => {
    const total = order.orderLines.reduce((acc, line) => acc + line.price * line.quantity, 0);
    const paidAmount = order.payments.reduce((acc, p) => acc + p.amount, 0);
    const balanceDue = total - paidAmount;
    return { ...order, total, paidAmount, balanceDue };
}

const initialState: AppState = {
  products: PRODUCTS,
  categories: CATEGORIES,
  currentOrder: getInitialOrder(),
  savedOrders: [],
  theme: 'light',
  isEditingOrder: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_PRODUCT_TO_ORDER': {
      const product = action.payload;
      const existingLine = state.currentOrder.orderLines.find(
        (line) => line.productId === product.id
      );

      let newOrderLines;
      if (existingLine) {
        newOrderLines = state.currentOrder.orderLines.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      } else {
        const newLine: OrderLine = {
            lineId: `line-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.basePrice,
            quantity: 1,
            imageUrl: product.imageUrl,
            addedAt: new Date().toISOString(),
            isAddedLater: state.isEditingOrder,
            note: '',
        };
        newOrderLines = [...state.currentOrder.orderLines, newLine];
      }
      const updatedOrder = recalculateOrderFinancials({
          ...state.currentOrder,
          orderLines: newOrderLines,
      });
      return { ...state, currentOrder: updatedOrder };
    }
    case 'ADD_CUSTOM_ITEM_TO_ORDER': {
        const { name, quantity, price, note } = action.payload;
        const newCustomLine: OrderLine = {
            lineId: `line-${Date.now()}`,
            name,
            price,
            quantity,
            imageUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/400/400`,
            addedAt: new Date().toISOString(),
            isAddedLater: state.isEditingOrder,
            note: note || '',
        };
        const newOrderLines = [...state.currentOrder.orderLines, newCustomLine];
        const updatedOrder = recalculateOrderFinancials({
            ...state.currentOrder,
            orderLines: newOrderLines,
        });
        return { ...state, currentOrder: updatedOrder };
    }
    case 'UPDATE_ORDER_LINE_DETAILS': {
        const { lineId, ...details } = action.payload;
        const newOrderLines = state.currentOrder.orderLines.map((line) =>
            line.lineId === lineId ? { ...line, ...details } : line
        );
        const updatedOrder = recalculateOrderFinancials({
            ...state.currentOrder,
            orderLines: newOrderLines,
        });
        return { ...state, currentOrder: updatedOrder };
    }
    case 'REMOVE_ORDER_LINE': {
        const lineIdToRemove = action.payload;
        const newOrderLines = state.currentOrder.orderLines.filter(
            (line) => line.lineId !== lineIdToRemove
        );
        const updatedOrder = recalculateOrderFinancials({
            ...state.currentOrder,
            orderLines: newOrderLines,
        });
        return { ...state, currentOrder: updatedOrder };
    }
    case 'UPDATE_CUSTOMER_DETAILS': {
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case 'ADD_PAYMENT': {
        const newPayment: Payment = {
            id: `payment-${Date.now()}`,
            amount: action.payload,
            date: new Date().toISOString(),
        };
        const updatedOrder = recalculateOrderFinancials({
            ...state.currentOrder,
            payments: [...state.currentOrder.payments, newPayment]
        });
        return { ...state, currentOrder: updatedOrder };
    }
    case 'ADD_PAYMENT_TO_SAVED_ORDER': {
        const { orderId, amount } = action.payload;
        const newSavedOrders = state.savedOrders.map(order => {
            if (order.id === orderId) {
                const newPayment: Payment = {
                    id: `payment-${Date.now()}`,
                    amount: amount,
                    date: new Date().toISOString(),
                };
                const updatedOrderWithPayment = {
                    ...order,
                    payments: [...order.payments, newPayment],
                };
                return recalculateOrderFinancials(updatedOrderWithPayment);
            }
            return order;
        });
        return { ...state, savedOrders: newSavedOrders };
    }
    case 'REMOVE_PAYMENT': {
        const paymentIdToRemove = action.payload;
        const updatedPayments = state.currentOrder.payments.filter(p => p.id !== paymentIdToRemove);
        const updatedOrder = recalculateOrderFinancials({
            ...state.currentOrder,
            payments: updatedPayments,
        });
        return { ...state, currentOrder: updatedOrder };
    }
    case 'SAVE_ORDER': {
      const orderToSave = { ...state.currentOrder };
      if(!orderToSave.createdAt) {
        orderToSave.createdAt = new Date().toISOString();
      }
      const existingOrderIndex = state.savedOrders.findIndex(o => o.id === orderToSave.id);

      let newSavedOrders;
      if (existingOrderIndex > -1) {
        newSavedOrders = [...state.savedOrders];
        newSavedOrders[existingOrderIndex] = orderToSave;
      } else {
        newSavedOrders = [orderToSave, ...state.savedOrders];
      }
      
      newSavedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        ...state,
        savedOrders: newSavedOrders,
        currentOrder: getInitialOrder(),
        isEditingOrder: false,
      };
    }
    case 'DELETE_SAVED_ORDER': {
      return {
        ...state,
        savedOrders: state.savedOrders.filter(o => o.id !== action.payload)
      }
    }
    case 'CLEAR_ORDER': {
      return { ...state, currentOrder: getInitialOrder(), isEditingOrder: false };
    }
    case 'LOAD_ORDER': {
        return {...state, currentOrder: action.payload.order, isEditingOrder: action.payload.isEditing };
    }
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: newTheme };
    }
    case 'SET_PRODUCTS': {
      return { ...state, products: action.payload };
    }
    case 'ADD_PRODUCT': {
      return { ...state, products: [...state.products, action.payload] };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    }
    case 'DELETE_PRODUCT': {
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    }
    case 'ADD_CATEGORY': {
      return { ...state, categories: [...state.categories, action.payload] };
    }
    case 'UPDATE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c),
      };
    }
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedOrders, setSavedOrders] = useLocalStorage<Order[]>('rafiq-saved-orders', []);
  const [theme, setTheme] = useLocalStorage<Theme>('rafiq-theme', 'light');
  const [products, setProducts] = useLocalStorage<Product[]>('rafiq-products', PRODUCTS);
  const [categories, setCategories] = useLocalStorage<Category[]>('rafiq-categories', CATEGORIES);

  const initialAppState: AppState = {
    ...initialState,
    savedOrders,
    theme,
    products,
    categories,
  };

  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    setSavedOrders(state.savedOrders);
  }, [state.savedOrders, setSavedOrders]);

  useEffect(() => {
    setTheme(state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme, setTheme]);

  useEffect(() => {
    setProducts(state.products);
  }, [state.products, setProducts]);

  useEffect(() => {
    setCategories(state.categories);
  }, [state.categories, setCategories]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
