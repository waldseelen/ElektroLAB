import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DEVICES } from '../data';
import { Filter } from 'lucide-react';

const DeviceCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  
  // We keep local state for category because it's a UI filter, 
  // though it could also be synced to URL if desired. For now, keep it simple as requested.
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const categories = ['Tümü', ...Array.from(new Set(DEVICES.map(d => d.category)))];

  const categoryEmojis: Record<string, string> = {
    'Mutfak Elektroniği': '🍳',
    'Temizlik ve Banyo Grubu': '🧼',
    'Salon ve Eğlence Sistemleri': '📺',
    'Çalışma Odası ve Kişisel Cihazlar': '💻',
    'İklimlendirme ve Aydınlatma': '💡',
    'Diğer Ev Aletleri': '🔌'
  };

  const filteredDevices = useMemo(() => {
    return DEVICES.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            device.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Tümü' || device.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Cihaz Kataloğu</h1>
        <p className="text-slate-600 mt-2">
          Ev elektroniği cihazlarının iç yapısını, blok diyagramlarını ve arıza haritalarını inceleyin.
        </p>
      </div>

      {/* Filters - Expanded full width without search bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center text-slate-500 text-sm font-medium mr-2">
             <Filter className="w-4 h-4 mr-2" />
             Kategoriler:
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-start flex-grow">
            {categories.map(cat => (
                <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border ${
                    selectedCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-accent hover:text-accent hover:bg-white'
                }`}
                >
                {categoryEmojis[cat]} {cat}
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Result Info */}
      {searchTerm && (
        <div className="text-sm text-slate-500">
            "{searchTerm}" için {filteredDevices.length} sonuç bulundu.
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(device => (
          <Link key={device.id} to={`/devices/${device.id}`} className="group block h-full">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col hover:-translate-y-1 duration-300">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={device.imageUrl} 
                  alt={device.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                   <span className="text-[10px] font-bold text-slate-700 bg-white/95 backdrop-blur-sm px-2 py-1 rounded shadow-sm flex items-center gap-1 border border-slate-100">
                    {categoryEmojis[device.category]} {device.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-accent transition-colors line-clamp-1">
                  {device.name}
                </h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {device.overview}
                </p>
                <div className="flex flex-wrap gap-1 mt-auto pt-4">
                  {device.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500">
                <span>{device.module_map.length} Modül</span>
                <span className="group-hover:translate-x-1 transition-transform text-accent">Detayları Gör →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">Aradığınız kriterlere uygun cihaz bulunamadı.</p>
          <button 
            onClick={() => {setSearchParams({}); setSelectedCategory('Tümü');}}
            className="mt-4 text-accent hover:underline font-medium"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceCatalog;