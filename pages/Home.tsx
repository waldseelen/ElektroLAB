import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, AlertTriangle } from 'lucide-react';
import { MODULES, DEVICES } from '../data';

const HomePage = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight leading-tight">
          Elektroniği <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">Modül Modül</span> Keşfet
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
          Karmaşık ev aletlerini temel yapı taşlarına ayırarak çalışma prensiplerini ve arıza senaryolarını öğrenin.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Link 
            to="/devices" 
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            Cihazları İncele <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link 
            to="/modules" 
            className="inline-flex items-center justify-center bg-white text-primary border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-accent hover:text-accent hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            Modül Kütüphanesi
          </Link>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Modüler Yaklaşım</h3>
          <p className="text-slate-600 leading-relaxed">
            Tüm cihazlar M0..M7 arası standart modüllerin birleşimidir. Bir kere öğren, her yerde uygula.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-colors">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Layers className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Sistem Topolojileri</h3>
          <p className="text-slate-600 leading-relaxed">
            Flyback, FOC, PFC gibi endüstri standardı topolojilerin nerede ve neden kullanıldığını anlayın.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-red-200 transition-colors">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Arıza Analizi</h3>
          <p className="text-slate-600 leading-relaxed">
            Semptomlardan yola çıkarak potansiyel kök nedenlere ve ilgili devre bloklarına ulaşın.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-primary">Popüler Cihazlar</h2>
          <Link to="/devices" className="text-accent text-sm font-bold hover:underline flex items-center">
            Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEVICES.slice(0, 4).map(device => (
            <Link key={device.id} to={`/devices/${device.id}`} className="block group h-full">
              <div className="bg-white rounded-xl border border-slate-200 hover:border-accent hover:shadow-lg transition-all h-full overflow-hidden flex flex-col">
                <div className="h-40 w-full bg-slate-50 relative overflow-hidden">
                  <img 
                    src={device.imageUrl} 
                    alt={device.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                      {device.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-accent transition-colors mb-2">{device.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{device.overview}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

       {/* Module Quick Links */}
       <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-primary">Temel Modüller</h2>
          <Link to="/modules" className="text-accent text-sm font-bold hover:underline flex items-center">
            Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.slice(0, 4).map(mod => (
            <Link key={mod.id} to={`/modules/${mod.id}`} className="block group">
              <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-accent hover:shadow-md transition-all h-full flex items-center gap-3">
                 <div className="bg-slate-100 text-slate-600 text-sm font-mono font-bold px-3 py-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                   {mod.id}
                 </div>
                <h3 className="font-bold text-slate-700 group-hover:text-slate-900">{mod.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;