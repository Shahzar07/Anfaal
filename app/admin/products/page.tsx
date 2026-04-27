'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', images: '', sizes: 'S,M,L,XL', stock: '10'
  });

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
      images: p.images.join(', '),
      sizes: p.sizes.join(','),
      stock: p.stock.toString()
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingId;
    const id = isEditing ? editingId! : 'p-' + Date.now();
    
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(formData.stock),
      updatedAt: Date.now(),
      ...(isEditing ? {} : { createdAt: Date.now() })
    };

    await setDoc(doc(db, 'products', id), productData, { merge: true });
    setShowModal(false);
    setFormData({ name: '', price: '', category: '', description: '', images: '', sizes: 'S,M,L,XL', stock: '10' });
    setEditingId(null);
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl">Products</h2>
        <button 
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="bg-black text-white px-6 py-2 font-accent tracking-widest text-xs uppercase"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white border text-sm font-body border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img src={p.images?.[0]} alt="" className="w-12 h-12 object-cover bg-gray-100" />
                  </td>
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3">PKR {p.price}</td>
                  <td className="px-6 py-3">{p.category}</td>
                  <td className="px-6 py-3">{p.stock}</td>
                  <td className="px-6 py-3 space-x-4">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl mb-6">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Name</label>
                  <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border p-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Price (PKR)</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full border p-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Category</label>
                  <input required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border p-2 placeholder-gray-400" placeholder="e.g. hoodies, t-shirts" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Description</label>
                <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full border p-2" rows={3} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Images (comma separated URLs)</label>
                <textarea required value={formData.images} onChange={e=>setFormData({...formData, images: e.target.value})} className="w-full border p-2" rows={3} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1">Sizes (comma separated)</label>
                <input required value={formData.sizes} onChange={e=>setFormData({...formData, sizes: e.target.value})} className="w-full border p-2" />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border font-accent text-xs">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-black text-white font-accent text-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
