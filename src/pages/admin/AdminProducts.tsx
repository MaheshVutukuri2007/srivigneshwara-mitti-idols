import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Star, Search, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Category } from '../../types';

// Canvas-based image compression helper to keep Base64 strings small (<150KB) and prevent Firestore document size errors
const compressImageFile = (file: File, maxDimension = 1000, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Async Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [heightInInches, setHeightInInches] = useState<number>(12);
  const [stock, setStock] = useState<number>(15);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      const catSnap = await getDocs(collection(db, 'categories'));

      setProducts(prodSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    try {
      const compressedList = await Promise.all(
        Array.from(files).map((file: File) => compressImageFile(file))
      );
      setImages((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Error compressing uploaded images:', err);
      alert('Failed to process one or more images.');
    } finally {
      setIsProcessingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenModal = (p?: Product) => {
    if (p) {
      setEditingProd(p);
      setName(p.name);
      setSku(p.sku);
      setCategoryId(p.categoryId || categories[0]?.id || '');
      setCategoryName(p.categoryName || '');
      setPrice(p.price);
      setOriginalPrice(p.originalPrice || Math.round(p.price * 1.25));
      setHeightInInches(p.heightInInches);
      setStock(p.stock);
      setDescription(p.description || '');
      setImages(p.images || []);
      setIsFeatured(p.isFeatured || false);
      setIsTrending(p.isTrending || false);
    } else {
      setEditingProd(null);
      setName('');
      setSku(`SVI-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategoryId(categories[0]?.id || '');
      setCategoryName(categories[0]?.name || '');
      setPrice(999);
      setOriginalPrice(1299);
      setHeightInInches(12);
      setStock(10);
      setDescription('');
      setImages([]);
      setIsFeatured(false);
      setIsTrending(false);
    }
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a valid Idol Name.');
      return;
    }

    setIsSaving(true);
    const selectedCat = categories.find((c) => c.id === categoryId);

    const defaultImages = [
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800',
    ];

    const prodData: Omit<Product, 'id'> = {
      name: name.trim(),
      sku: sku.trim() || `SVI-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId,
      categoryName: selectedCat?.name || categoryName || 'Eco Clay Idol',
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      heightInInches: Number(heightInInches),
      widthInInches: Math.round(Number(heightInInches) * 0.7),
      weightInKg: Math.round(Number(heightInInches) * 0.25),
      stock: Number(stock),
      description: description.trim(),
      material: 'Unbaked Ganga Water Clay',
      colour: 'Natural Clay & Organic Turmeric / Kumkum',
      images: images.length > 0 ? images : defaultImages,
      isActive: true,
      isFeatured,
      isTrending,
      dissolvesInWaterMins: 30,
      hasSeeds: false,
      createdAt: editingProd?.createdAt || new Date().toISOString(),
    };

   try {

  console.log("========== SAVE STARTED ==========");
  console.log("Product Data:", prodData);

  if (editingProd) {

    console.log("Updating Product...");
    console.log("Document ID:", editingProd.id);

    await updateDoc(
      doc(db, "products", editingProd.id),
      prodData
    );

    console.log("✅ Product Updated Successfully");

  } else {

    console.log("Adding New Product...");

    const ref = await addDoc(
      collection(db, "products"),
      prodData
    );

    console.log("✅ Product Added Successfully");
    console.log("Document ID:", ref.id);

  }

  console.log("Refreshing Product List...");

  setIsModalOpen(false);

  await fetchData();

  console.log("========== SAVE COMPLETED ==========");

} catch (err: any) {

  console.error("❌ SAVE FAILED");
  console.error(err);

  alert(
    err?.message ||
    "Failed to save product."
  );

} finally {

  console.log("Loading Stopped");

  setIsSaving(false);

}
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Ganesh idol from inventory?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (p: Product) => {
    try {
      await updateDoc(doc(db, 'products', p.id), { isFeatured: !p.isFeatured });
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isFeatured: !item.isFeatured } : item))
      );
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-extrabold text-2xl text-stone-100">
            Ganesh Idol Inventory Catalog
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage live pricing, stock availability, multi-image galleries, and featured collections.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#FF7A00] hover:bg-amber-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> Add New Eco Idol
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex items-center gap-2">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="flex-1 bg-transparent border-none text-xs text-stone-200 outline-none"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-xs text-stone-400 py-12 text-center flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF7A00]" />
          <span>Loading inventory catalog...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-stone-600 mx-auto" />
          <p className="font-serif font-bold text-stone-200 text-lg">No Ganesh Idols in Inventory</p>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Click the "Add New Eco Idol" button above to upload your first Ganesh Idol to the store catalog.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#FF7A00] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Upload First Product
          </button>
        </div>
      ) : (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/50 text-stone-400 font-bold uppercase">
                  <th className="py-3 px-4">Idol Image</th>
                  <th className="py-3 px-4">Name & SKU</th>
                  <th className="py-3 px-4">Height</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800'}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-xl bg-stone-800"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-100">{prod.name}</p>
                      <span className="text-[10px] text-stone-500 font-mono">{prod.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-300">{prod.heightInInches}" Inches</td>
                    <td className="py-3 px-4 font-extrabold text-[#FF7A00]">₹{prod.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          prod.stock > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {prod.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(prod)}
                        className={`p-1.5 rounded-lg border ${
                          prod.isFeatured
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'text-stone-600 border-stone-800'
                        }`}
                        title="Toggle Homepage Feature"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleOpenModal(prod)}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-2 rounded-lg border border-stone-700"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        disabled={deletingId === prod.id}
                        className="bg-stone-800 hover:bg-rose-950 text-rose-400 p-2 rounded-lg border border-stone-700 disabled:opacity-50"
                        title="Delete Product"
                      >
                        {deletingId === prod.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal - Fixed Layout & Smooth Inner Scroll */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs my-auto">
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-800 shrink-0 bg-stone-900">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF7A00]" />
                {editingProd ? 'Edit Ganesh Idol' : 'Add New Eco Clay Ganesh Idol'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveProduct} className="flex flex-col min-h-0 flex-1">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-300">Idol Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Traditional Siddhi Vinayaka Idol"
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none focus:border-[#FF7A00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">SKU Code *</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none font-mono focus:border-[#FF7A00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none focus:border-[#FF7A00]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">Height (Inches) *</label>
                    <input
                      type="number"
                      value={heightInInches}
                      onChange={(e) => setHeightInInches(Number(e.target.value))}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none focus:border-[#FF7A00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none font-bold text-[#FF7A00] focus:border-[#FF7A00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">Original MRP Price (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-300">Available Stock Quantity *</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full p-2.5 mt-1 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none font-bold focus:border-[#FF7A00]"
                      required
                    />
                  </div>
                </div>

                {/* Photo Upload & Gallery Section */}
                <div className="space-y-3 pt-2">
                  <label className="font-bold text-stone-300 block">Product Photos (Upload or Image URL)</label>

                  {/* File Dropzone & Selector */}
                  <div className="border-2 border-dashed border-stone-700 bg-stone-800/60 rounded-2xl p-4 text-center hover:border-[#FF7A00] transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      disabled={isProcessingImages}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-stone-700/80 flex items-center justify-center text-[#FF7A00] group-hover:scale-110 transition-transform">
                        {isProcessingImages ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-200 text-xs">
                          {isProcessingImages ? 'Optimizing image files...' : 'Click to Browse Files or Drag & Drop Photos'}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          Select photo files from your device (automatically compressed).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Or Input Direct Image URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste direct image URL (Unsplash, ImageKit, etc.)"
                      className="flex-1 p-2 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 text-[11px] font-mono outline-none focus:border-[#FF7A00]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3 py-2 rounded-xl border border-stone-700 shrink-0"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Uploaded Photos Grid */}
                  {images.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-stone-400">
                        Attached Photo Files ({images.length})
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-stone-700 bg-stone-800 aspect-square"
                          >
                            <img src={img} alt={`Product photo ${idx + 1}`} className="w-full h-full object-cover" />

                            {idx === 0 && (
                              <span className="absolute top-1 left-1 bg-[#FF7A00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                Cover
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-stone-900/90 hover:bg-rose-600 text-stone-200 hover:text-white p-1 rounded-full transition-colors shadow"
                              title="Remove image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-stone-300 block mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe craftsmanship, eco-friendly features, and inclusions..."
                    className="w-full p-2.5 bg-stone-800 rounded-xl border border-stone-700 text-stone-100 outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-400">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#FF7A00]"
                    />
                    <span>Feature on Homepage Slider</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-400">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="accent-rose-500"
                    />
                    <span>Mark as Trending Idol</span>
                  </label>
                </div>
              </div>

              {/* Modal Fixed Footer */}
              <div className="p-4 border-t border-stone-800 flex items-center justify-end gap-3 shrink-0 bg-stone-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isProcessingImages}
                  className="px-6 py-2 bg-[#FF7A00] hover:bg-amber-600 text-white rounded-xl font-bold shadow flex items-center gap-2 transition-transform disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSaving ? 'Saving Idol...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

