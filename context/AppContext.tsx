import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, Category, Order, OrderLine } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface AppState {
  products: Product[];
  categories: Category[];
  currentOrder: Order;
  savedOrders: Order[];
  theme: Theme;
}

type Action =
  | { type: 'ADD_PRODUCT_TO_ORDER'; payload: Product }
  | { type: 'UPDATE_ORDER_LINE'; payload: { productId: string; quantity: number; price: number } }
  | { type: 'REMOVE_ORDER_LINE'; payload: string }
  | { type: 'UPDATE_CUSTOMER_DETAILS'; payload: { name: string; value: string } }
  | { type: 'SAVE_ORDER' }
  | { type: 'CLEAR_ORDER' }
  | { type: 'LOAD_ORDER'; payload: Order }
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
  total: 0,
  createdAt: new Date().toISOString(),
});

const calculateTotal = (lines: OrderLine[]): number => {
  return lines.reduce((acc, line) => acc + line.price * line.quantity, 0);
};

const initialState: AppState = {
  products: PRODUCTS,
  categories: CATEGORIES,
  currentOrder: getInitialOrder(),
  savedOrders: [],
  theme: 'light',
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
        newOrderLines = [
          ...state.currentOrder.orderLines,
          {
            productId: product.id,
            nameSnapshot: product.name,
            price: product.basePrice,
            quantity: 1,
            imageUrlSnapshot: product.imageUrl,
          },
        ];
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          orderLines: newOrderLines,
          total: calculateTotal(newOrderLines),
        },
      };
    }
    case 'UPDATE_ORDER_LINE': {
        const { productId, quantity, price } = action.payload;
        const newOrderLines = state.currentOrder.orderLines.map((line) =>
            line.productId === productId ? { ...line, quantity, price } : line
        );
        return {
            ...state,
            currentOrder: {
                ...state.currentOrder,
                orderLines: newOrderLines,
                total: calculateTotal(newOrderLines),
            },
        };
    }
    case 'REMOVE_ORDER_LINE': {
        const productIdToRemove = action.payload;
        const newOrderLines = state.currentOrder.orderLines.filter(
            (line) => line.productId !== productIdToRemove
        );
        return {
            ...state,
            currentOrder: {
                ...state.currentOrder,
                orderLines: newOrderLines,
                total: calculateTotal(newOrderLines),
            },
        };
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
    case 'SAVE_ORDER': {
      const orderToSave = { ...state.currentOrder, createdAt: new Date().toISOString() };
      return {
        ...state,
        savedOrders: [orderToSave, ...state.savedOrders],
        currentOrder: getInitialOrder(),
      };
    }
    case 'CLEAR_ORDER': {
      return { ...state, currentOrder: getInitialOrder() };
    }
    case 'LOAD_ORDER': {
        return {...state, currentOrder: action.payload};
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