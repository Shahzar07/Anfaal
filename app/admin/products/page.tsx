'use client';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ImagePlus, X, Upload, Package } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', images: [] as string[], sizes: 'S,M,L,XL', stock: '10', colors: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await deleteDoc(doc(db, 'products', id));
    loadProducts();
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      images: p.images || [],
      sizes: p.sizes ? p.sizes.join(',') : 'S,M,L,XL',
      stock: p.stock?.toString() || '0',
      colors: p.colors ? p.colors.join(',') : ''
    });
    setShowModal(true);
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Resize image using canvas to save Firestore quota (max 1024px width)
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1000;
          
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compressing to webp with 0.8 quality
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(dataUrl);
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Process files sequentially
    const newImages = [...formData.images];
    
    for (let i = 0; i < e.target.files.length; i++) {
       const file = e.target.files[i];
       try {
         const base64 = await processFile(file);
         newImages.push(base64);
       } catch (err) {
         console.error('Error processing image:', err);
         alert('Failed to upload an image. Please try again or use smaller images.');
       }
    }
    
    setFormData({ ...formData, images: newImages });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const list = [...formData.images];
    list.splice(index, 1);
    setFormData({ ...formData, images: list });
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim() !== '') {
      setFormData({ ...formData, images: [...formData.images, url.trim()] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingId;
    const id = isEditing ? editingId! : 'p-' + Date.now();
    
    if (formData.images.length === 0) {
      alert("Please add at least one image.");
      return;
    }

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      images: formData.images,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(formData.stock),
      updatedAt: Date.now(),
      ...(isEditing ? {} : { createdAt: Date.now() })
    };

    await setDoc(doc(db, 'products', id), productData, { merge: true });
    setShowModal(false);
    setFormData({ name: '', price: '', category: '', description: '', images: [], sizes: 'S,M,L,XL', stock: '10', colors: '' });
    setEditingId(null);
    loadProducts();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h2 className="font-display text-3xl">Products</h2>
           <p className="font-body text-sm text-gray-500">Manage your store catalog and inventory.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ name: '', price: '', category: '', description: '', images: [], sizes: 'S,M,L,XL', stock: '10', colors: '' }); setShowModal(true); }}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-body text-sm font-medium transition-colors flex items-center"
        >
          <ImagePlus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm text-sm font-body border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        {p.images?.[0] ? (
                          <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">{p.name}</td>
                    <td className="px-6 py-4">
                       <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 capitalize">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">PKR {p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3 text-right">
                      <button onClick={() => handleEdit(p)} className="text-gray-500 hover:text-black font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                   <tr>
                     <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No products found. Create one.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-display text-2xl">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar space-y-8 font-body">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                    <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="e.g. Onyx Heavyweight Hoodie" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (PKR)</label>
                    <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="5000" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all min-h-[100px]" placeholder="Detailed product description..." />
                </div>
              </div>

              {/* Organization & Inventory */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Organization & Inventory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <input required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm" placeholder="e.g. hoodies, t-shirts, accessories" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                    <input required type="number" min="0" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>

              {/* Variations */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg border-b pb-2">Variations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Sizes <span className="text-gray-400 font-normal">(comma separated)</span></label>
                    <input required value={formData.sizes} onChange={e=>setFormData({...formData, sizes: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" placeholder="S, M, L, XL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Colors <span className="text-gray-400 font-normal">(optional, comma separated)</span></label>
                    <input value={formData.colors} onChange={e=>setFormData({...formData, colors: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" placeholder="Black, Charcoal, Navy" />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b pb-2">
                   <h4 className="font-medium text-lg">Product Media</h4>
                   <button type="button" onClick={handleAddImageUrl} className="text-sm font-medium text-blue-600 hover:text-blue-800">Add Image URL manually</button>
                </div>
                
                {/* Upload zone */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                   <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                     <Upload size={20} className="text-gray-500" />
                   </div>
                   <p className="font-medium text-gray-800 mb-1">Click to upload product images</p>
                   <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP (auto-compressed)</p>
                </div>

                {/* Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={() => removeImage(i)}
                            className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {i === 0 && (
                          <div className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Thumbnail
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Area */}
              <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-8 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md flex items-center">
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
