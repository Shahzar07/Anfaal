'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Users, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Form Entries', href: '/admin/forms', icon: MessageSquare },
    { name: 'Staff & Managers', href: '/admin/staff', icon: Users },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/products')) return 'Products';
    if (pathname.startsWith('/admin/forms')) return 'Form Entries';
    if (pathname.startsWith('/admin/staff')) return 'Staff & Managers';
    return 'Admin';
  };

  return (
    <div className="flex h-screen bg-[#fafafa] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-display text-2xl tracking-widest text-[#111]">ANFAAL</h2>
          <p className="font-accent text-[10px] tracking-widest text-gray-500 uppercase mt-1">Workspace</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left font-body text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10 sticky top-0">
          <h1 className="font-display text-2xl text-black">{getPageTitle()}</h1>
          <div className="flex items-center">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-body font-medium text-gray-600 hover:text-black transition-colors bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200">
              <ExternalLink size={14} className="mr-2" />
              Live Store
            </a>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-[#fafafa]">
          {children}
        </div>
      </main>
    </div>
  );
}
