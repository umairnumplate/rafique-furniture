export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  description: string;
  basePrice: number;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface OrderLine {
  lineId: string; // Unique ID for this specific line item
  productId?: string; // Will be undefined for custom/other items
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  addedAt: string; // ISO string date for when the item was added to the order
  isAddedLater: boolean; // True if added after the order was first created
  note?: string; // Optional item-specific note
}

export interface Payment {
  id:string;
  amount: number;
  date: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderLines: OrderLine[];
  payments: Payment[];
  total: number;
  paidAmount: number;
  balanceDue: number;
  createdAt: string; 
  notes?: string;
}
