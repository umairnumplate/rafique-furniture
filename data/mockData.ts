
import type { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Beds', imageUrl: 'https://picsum.photos/seed/beds/400/400' },
  { id: 'cat2', name: 'Dressing Tables', imageUrl: 'https://picsum.photos/seed/dressing/400/400' },
  { id: 'cat3', name: 'Sofas', imageUrl: 'https://picsum.photos/seed/sofas/400/400' },
  { id: 'cat4', name: 'Showcases', imageUrl: 'https://picsum.photos/seed/showcases/400/400' },
  { id: 'cat5', name: 'Dining', imageUrl: 'https://picsum.photos/seed/dining/400/400' },
  { id: 'cat6', name: 'Chairs', imageUrl: 'https://picsum.photos/seed/chairs/400/400' },
  { id: 'cat7', name: 'Wardrobes', imageUrl: 'https://picsum.photos/seed/wardrobes/400/400' },
  { id: 'cat8', name: 'Kids', imageUrl: 'https://picsum.photos/seed/kids/400/400' },
  { id: 'cat9', name: 'Office', imageUrl: 'https://picsum.photos/seed/office/400/400' },
  { id: 'cat10', name: 'Decor', imageUrl: 'https://picsum.photos/seed/decor/400/400' },
];

export const PRODUCTS: Product[] = [
  // Beds
  { id: 'prod1', sku: 'BED-001', name: 'Classic King Bed', categoryId: 'cat1', description: 'King size wooden bed with a classic finish.', basePrice: 85000, imageUrl: 'https://picsum.photos/seed/bed001/600/600' },
  { id: 'prod2', sku: 'BED-002', name: 'Modern Queen Bed', categoryId: 'cat1', description: 'Upholstered queen bed with a modern design.', basePrice: 72000, imageUrl: 'https://picsum.photos/seed/bed002/600/600' },
  { id: 'prod19', sku: 'BED-003', name: 'Bunk Bed', categoryId: 'cat1', description: 'Space saving bunk bed for kids.', basePrice: 45000, imageUrl: 'https://picsum.photos/seed/bed003/600/600' },

  // Dressing Tables
  { id: 'prod3', sku: 'DRESS-001', name: 'Silver Vanity Table', categoryId: 'cat2', description: 'Elegant dressing table with a large mirror.', basePrice: 18000, imageUrl: 'https://picsum.photos/seed/dress001/600/600' },
  { id: 'prod4', sku: 'DRESS-002', name: 'Compact Dresser', categoryId: 'cat2', description: 'A compact dresser with multiple drawers.', basePrice: 15000, imageUrl: 'https://picsum.photos/seed/dress002/600/600' },

  // Sofas
  { id: 'prod5', sku: 'SOFA-001', name: '5-Seater L-Shape Sofa', categoryId: 'cat3', description: 'Comfortable fabric L-shape sofa for living rooms.', basePrice: 65000, imageUrl: 'https://picsum.photos/seed/sofa001/600/600' },
  { id: 'prod6', sku: 'SOFA-002', name: 'Leather 3-Seater', categoryId: 'cat3', description: 'Premium leather sofa.', basePrice: 95000, imageUrl: 'https://picsum.photos/seed/sofa002/600/600' },

  // Showcases
  { id: 'prod7', sku: 'SHOW-001', name: 'Glass Display Cabinet', categoryId: 'cat4', description: 'Tall glass cabinet to display your valuables.', basePrice: 22000, imageUrl: 'https://picsum.photos/seed/show001/600/600' },

  // Dining
  { id: 'prod8', sku: 'DIN-001', name: '6-Seater Dining Table', categoryId: 'cat5', description: 'Wooden dining table with 6 matching chairs.', basePrice: 55000, imageUrl: 'https://picsum.photos/seed/din001/600/600' },
  { id: 'prod9', sku: 'DIN-002', name: '4-Seater Round Table', categoryId: 'cat5', description: 'Glass top round table, perfect for small families.', basePrice: 38000, imageUrl: 'https://picsum.photos/seed/din002/600/600' },
  
  // Chairs
  { id: 'prod10', sku: 'CHR-001', name: 'Accent Chair', categoryId: 'cat6', description: 'A stylish accent chair to complement any room.', basePrice: 12000, imageUrl: 'https://picsum.photos/seed/chr001/600/600' },
  { id: 'prod11', sku: 'CHR-002', name: 'Rocking Chair', categoryId: 'cat6', description: 'Classic wooden rocking chair.', basePrice: 9000, imageUrl: 'https://picsum.photos/seed/chr002/600/600' },
  
  // Wardrobes
  { id: 'prod12', sku: 'WARD-001', name: '3-Door Wardrobe', categoryId: 'cat7', description: 'Spacious 3-door wardrobe with mirror.', basePrice: 48000, imageUrl: 'https://picsum.photos/seed/ward001/600/600' },
  { id: 'prod13', sku: 'WARD-002', name: 'Sliding Door Closet', categoryId: 'cat7', description: 'Modern closet with smooth sliding doors.', basePrice: 62000, imageUrl: 'https://picsum.photos/seed/ward002/600/600' },
  
  // Kids
  { id: 'prod14', sku: 'KID-001', name: 'Kids Study Table', categoryId: 'cat8', description: 'Colorful and durable study table for children.', basePrice: 7500, imageUrl: 'https://picsum.photos/seed/kid001/600/600' },
  { id: 'prod15', sku: 'KID-002', name: 'Toy Storage Box', categoryId: 'cat8', description: 'Large capacity toy storage box.', basePrice: 4000, imageUrl: 'https://picsum.photos/seed/kid002/600/600' },
  
  // Office
  { id: 'prod16', sku: 'OFF-001', name: 'Executive Office Desk', categoryId: 'cat9', description: 'Large office desk with drawers.', basePrice: 35000, imageUrl: 'https://picsum.photos/seed/off001/600/600' },
  { id: 'prod17', sku: 'OFF-002', name: 'Ergonomic Office Chair', categoryId: 'cat9', description: 'Comfortable chair for long working hours.', basePrice: 18000, imageUrl: 'https://picsum.photos/seed/off002/600/600' },

  // Decor
  { id: 'prod18', sku: 'DEC-001', name: 'Wall Mirror', categoryId: 'cat10', description: 'Decorative wall mirror with ornate frame.', basePrice: 6000, imageUrl: 'https://picsum.photos/seed/dec001/600/600' },
];
