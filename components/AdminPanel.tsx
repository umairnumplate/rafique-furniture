import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Product, Category } from '../types';

const AdminPanel: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { categories, products } = state;

    // --- Product Management State ---
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'imageUrl'>>({
        sku: '', name: '', categoryId: '', description: '', basePrice: 0,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const productFileInputRef = useRef<HTMLInputElement>(null);

    // --- Category Management State ---
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'imageUrl'>>({ name: '' });
    const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
    const categoryFileInputRef = useRef<HTMLInputElement>(null);


    // --- Category Handlers ---
    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setCategoryImagePreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setCategoryImagePreview(editingCategory ? editingCategory.imageUrl : null);
        }
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setNewCategory({ name: '' });
        setCategoryImagePreview(null);
        if (categoryFileInputRef.current) categoryFileInputRef.current.value = "";
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name) {
            alert('Please enter a category name.');
            return;
        }

        if (editingCategory) {
            const updatedCategory: Category = {
                ...editingCategory,
                ...newCategory,
                imageUrl: categoryImagePreview || editingCategory.imageUrl
            };
            dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
            alert('Category updated successfully!');
        } else {
            const categoryToAdd: Category = {
                ...newCategory,
                id: `cat-${Date.now()}`,
                imageUrl: categoryImagePreview || `https://picsum.photos/seed/${newCategory.name.replace(/\s+/g, '-')}/400/400`
            };
            dispatch({ type: 'ADD_CATEGORY', payload: categoryToAdd });
            alert('Category added successfully!');
        }
        resetCategoryForm();
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name });
        setCategoryImagePreview(category.imageUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (products.some(p => p.categoryId === categoryId)) {
            alert('Cannot delete category as it is in use. Please reassign or delete products in this category first.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
        }
    };

    // --- Product Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: name === 'basePrice' ? Number(value) : value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setImagePreview(editingProduct ? editingProduct.imageUrl : null);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setNewProduct({ sku: '', name: '', categoryId: '', description: '', basePrice: 0 });
        setImagePreview(null);
        if (productFileInputRef.current) productFileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newProduct.sku || !newProduct.name || !newProduct.categoryId || newProduct.basePrice <= 0) {
            alert('Please fill all required product fields with valid values.');
            return;
        }

        if (editingProduct) {
            const updatedProduct: Product = {
                ...editingProduct, ...newProduct,
                basePrice: Number(newProduct.basePrice),
                imageUrl: imagePreview || editingProduct.imageUrl
            };
            dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
            alert('Product updated successfully!');
        } else {
            const productToAdd: Product = {
                ...newProduct,
                id: `prod-${Date.now()}`,
                basePrice: Number(newProduct.basePrice),
                imageUrl: imagePreview || `https://picsum.photos/seed/${newProduct.sku}/600/600`
            };
            dispatch({ type: 'ADD_PRODUCT', payload: productToAdd });
            alert('Product added successfully!');
        }
        resetForm();
    };
    
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setNewProduct({
            sku: product.sku, name: product.name, categoryId: product.categoryId,
            description: product.description, basePrice: product.basePrice,
        });
        setImagePreview(product.imageUrl);
        const productForm = document.getElementById('product-form');
        productForm?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch({ type: 'DELETE_PRODUCT', payload: productId });
        }
    };

    const handleExportProducts = () => alert("This would export products to Excel/CSV.");
    const handleImportProducts = () => alert("This would import products from Excel/CSV.");

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 md:pb-4">
            <h2 className="text-3xl font-bold text-center text-primary dark:text-dark-primary">Admin Panel</h2>

            {/* --- CATEGORY MANAGEMENT --- */}
            <div id="category-form" className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Category Management</h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4 mt-4">
                    <h4 className="font-semibold text-lg">{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
                    <input type="text" name="name" placeholder="Category Name" value={newCategory.name} onChange={handleCategoryInputChange} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Image</label>
                        <div className="mt-1 flex items-center gap-4">
                             <span className="inline-block h-24 w-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                                {categoryImagePreview ? <img src={categoryImagePreview} alt="Category Preview" className="h-full w-full object-cover" /> : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                )}
                            </span>
                            <div className="flex-grow">
                                <input type="file" accept="image/*" capture="environment" ref={categoryFileInputRef} onChange={handleCategoryImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark dark:file:bg-dark-surface dark:file:text-primary-light hover:file:bg-primary-light/80 dark:hover:file:bg-gray-700 cursor-pointer"/>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select a file or use camera. Placeholder used if empty.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300">{editingCategory ? 'Update Category' : 'Add Category'}</button>
                        {editingCategory && <button type="button" onClick={resetCategoryForm} className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg">Cancel Edit</button>}
                    </div>
                </form>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 border-t pt-4">Existing Categories</h4>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded flex-shrink-0"/>
                                    <p className="font-semibold truncate">{cat.name}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => handleEditCategory(cat)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRODUCT MANAGEMENT --- */}
            <div id="product-form" className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Product Management</h3>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <h4 className="font-semibold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
                        <input type="text" name="sku" placeholder="SKU (Unique)" value={newProduct.sku} onChange={handleInputChange} required className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
                        <select name="categoryId" value={newProduct.categoryId} onChange={handleInputChange} required className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <input type="number" name="basePrice" placeholder="Base Price" value={newProduct.basePrice || ''} onChange={handleInputChange} required className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} rows={3} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
                        <div className="mt-1 flex items-center gap-4">
                            <span className="inline-block h-24 w-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                                {imagePreview ? <img src={imagePreview} alt="Product Preview" className="h-full w-full object-cover" /> : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                )}
                            </span>
                            <div className="flex-grow">
                                <input type="file" accept="image/*" capture="environment" ref={productFileInputRef} onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark dark:file:bg-dark-surface dark:file:text-primary-light hover:file:bg-primary-light/80 dark:hover:file:bg-gray-700 cursor-pointer"/>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use camera or select a file (PNG, JPG, etc.).</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                        {editingProduct && <button type="button" onClick={resetForm} className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg">Cancel Edit</button>}
                    </div>
                </form>
                 <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 border-t pt-4">Existing Products</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {products.length > 0 ? products.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded flex-shrink-0"/>
                                    <div className="min-w-0">
                                        <p className="font-semibold truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500">No products to display.</p>}
                    </div>
                </div>
            </div>

            {/* --- DATA MANAGEMENT --- */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Product Data Management</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <button onClick={handleImportProducts} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Import from Excel</button>
                    <button onClick={handleExportProducts} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Export to Excel</button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Import/Export functionality is for demonstration. In a real app, this would allow bulk updates to your product catalog using XLSX or CSV files.
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;