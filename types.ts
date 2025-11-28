
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
  productId: string;
  nameSnapshot: string;
  price: number;
  quantity: number;
  imageUrlSnapshot: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderLines: OrderLine[];
  total: number;
  createdAt: string; 
}
