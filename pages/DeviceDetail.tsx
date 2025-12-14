import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEVICES, MODULES } from '../data';
import BlockDiagram from '../components/BlockDiagram';
import RichText from '../components/RichText';
import { AlertTriangle, BookOpen, Layers, Cpu, Wrench, Activity, ChevronRight } from 'lucide-react';

const DeviceDetail = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = DEVICES.find(d => d.id === deviceId);
  const [activeTab, setActiveTab] = useState<'engineering' | 'failures' | 'learning'>('engineering');

  if (!device) {
    return <div className="p-8 text-center">Cihaz bulunamadı.</div>;
  }

  // Determine primary module for highlighting (usually Control M7 or Power M1)
  const primaryModuleId = device.module_map.find(m => m.moduleId === 'M7')?.moduleId || 
                          device.module_map.find(m => m.moduleId === 'M1')?.moduleId ||
                          device.module_map[0]?.moduleId;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-slate-200 pb-6">
        <div className="w-full md:w-72 h-48 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
          <img 
            src={device.imageUrl} 
            alt={device.name} 
            className="w-full h-full object-contain p-4"
          />
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
               <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-1 rounded mb-2 inline-block">
                 {device.category}
               </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{device.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
               {device.tags.map(tag => (
                 <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">#{tag}</span>
               ))}
            </div>
            <RichText text={device.overview} className="text-slate-600 text-lg" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('engineering')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'engineering' ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Activity className="w-4 h-4" /> Sistem Analizi & Çalışma Prensibi
        </button>
        <button 
          onClick={() => setActiveTab('failures')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'failures' ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Wrench className="w-4 h-4" /> Arıza Modları & Teşhis
        </button>
        <button 
          onClick={() => setActiveTab('learning')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'learning' ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen className="w-4 h-4" /> Mühendislik Notları
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'engineering' && (
            <>
               {/* Working Principle Section */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  Çalışma Prensibi Adımları
                </h2>
                <div className="space-y-4">
                  {device.working_principle?.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                        {idx + 1}
                      </div>
                      <div className="pt-1 text-slate-700 leading-relaxed">
                        <RichText text={step} />
                      </div>
                    </div>
                  )) || <p className="text-slate-500 italic">Çalışma prensibi verisi hazırlanıyor.</p>}
                </div>
              </section>

              {device.block_diagram && (
                <section>
                  <h2 className="text-lg font-bold text-primary mb-4">Sistem Blok Diyagramı</h2>
                  <BlockDiagram data={device.block_diagram} activeModuleId={primaryModuleId} />
                </section>
              )}

              <section>
                 <h2 className="text-lg font-bold text-primary mb-4">Modül Haritası</h2>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {device.module_map.map((item, idx) => {
                     const module = MODULES.find(m => m.id === item.moduleId);
                     return (
                       <Link key={idx} to={`/modules/${item.moduleId}`} className="flex items-center p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-sm transition-all group">
                         <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center font-mono font-bold text-slate-600 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors">
                           {item.moduleId}
                         </div>
                         <div className="ml-4 flex-grow">
                           <div className="font-bold text-slate-800 text-sm group-hover:text-accent transition-colors">{module?.name || item.moduleId}</div>
                           <div className="text-xs text-slate-500">{item.role}</div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-accent" />
                       </Link>
                     );
                   })}
                 </div>
              </section>
            </>
          )}

          {activeTab === 'failures' && (
            <section className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Mühendislik Notu:</strong> Arıza analizi, sistemin zayıf noktalarını anlamak ve daha dayanıklı tasarımlar yapmak için kritiktir.
                </p>
              </div>

              {device.failure_scenarios.map((scen, idx) => (
                <div key={idx} className="bg-white border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900">{scen.title}</h3>
                  <div className="mt-4 grid md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gözlemlenen Semptomlar</span>
                      <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                        {scen.symptoms.map((s, i) => <li key={i}><RichText text={s} /></li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Olası Kaynak Bileşenler</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {scen.likely_components.map((c, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded italic border border-slate-100">
                      <span className="font-bold text-slate-800 not-italic block mb-1">Teknik Analiz: </span>
                      <RichText text={scen.notes} />
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'learning' && (
             <section className="space-y-6">
               <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-lg">
                 <h3 className="font-bold text-emerald-800 mb-3 flex items-center"><BookOpen className="w-4 h-4 mr-2"/> Kazanımlar</h3>
                 <ul className="space-y-2">
                   {device.learning_notes.what_to_learn.map((item, idx) => (
                     <li key={idx} className="flex items-start text-sm text-emerald-900">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                       <RichText text={item} />
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="bg-white border border-slate-200 p-5 rounded-lg">
                 <h3 className="font-bold text-slate-800 mb-3">Sık Yapılan Yanlışlar</h3>
                 <ul className="space-y-2">
                   {device.learning_notes.common_misconceptions.map((item, idx) => (
                     <li key={idx} className="flex items-start text-sm text-slate-600">
                       <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-warning flex-shrink-0" />
                       <RichText text={item} />
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg">
                 <h3 className="font-bold text-blue-800 mb-3">Saha Deneyimi & İpuçları</h3>
                 <ul className="space-y-2 text-sm text-blue-900">
                   {device.learning_notes.practical_insights.map((item, idx) => (
                     <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <RichText text={item} />
                     </li>
                   ))}
                 </ul>
               </div>
             </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-primary" /> Sistem Topolojileri
            </h3>
            <div className="flex flex-wrap gap-2">
              {device.topologies_used.map((topo, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
                  {topo}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4">Kritik Bileşenler</h3>
             <ul className="text-sm space-y-2 text-slate-600">
               {device.typical_components.map((c, i) => <li key={i} className="flex items-center"><div className="w-1 h-1 bg-slate-400 rounded-full mr-2"></div>{c}</li>)}
             </ul>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4">Örnek Entegreler</h3>
             <ul className="text-xs font-mono space-y-2 text-slate-500">
               {device.typical_ic_families.map((c, i) => <li key={i} className="bg-slate-50 p-1.5 rounded border border-slate-100 text-center">{c}</li>)}
             </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border-l-4 border-red-500 shadow-sm">
            <h3 className="font-bold text-red-700 mb-2 text-sm flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/> Güvenlik Notları</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <RichText text={device.safety_notes.join(" ")} />
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeviceDetail;