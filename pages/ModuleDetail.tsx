import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES, DEVICES } from '../data';
import { AlertTriangle, CheckCircle, XCircle, Search, Box, Zap } from 'lucide-react';

const ModuleDetail = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = MODULES.find(m => m.id === moduleId);

  if (!module) {
    return <div className="p-8 text-center text-slate-500">Modül bulunamadı.</div>;
  }

  // Find devices using this module
  const relatedDevices = DEVICES.filter(d => d.module_map.some(m => m.moduleId === moduleId));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary text-white text-3xl font-mono font-bold px-4 py-2 rounded-lg">
            {module.id}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{module.name}</h1>
            <p className="text-slate-500">{module.summary}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {module.blocks.map((block, idx) => (
            <span key={idx} className="flex items-center text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
              <Box className="w-3 h-3 mr-1" /> {block}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Technical Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Topologies */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Kullanılan Topolojiler
            </h2>
            <div className="space-y-4">
              {module.topologies.map((topo, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-lg text-accent mb-2">{topo.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{topo.notes}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-600 uppercase mb-1">Avantajlar</h4>
                      <ul className="text-sm space-y-1">
                        {topo.pros.map((pro, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                            <span className="text-slate-600">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-red-500 uppercase mb-1">Dezavantajlar</h4>
                      <ul className="text-sm space-y-1">
                        {topo.cons.map((con, i) => (
                          <li key={i} className="flex items-start">
                            <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                            <span className="text-slate-600">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Failures */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Sık Görülen Arızalar
            </h2>
            <div className="space-y-4">
              {module.failure_modes.map((fail, idx) => (
                <div key={idx} className="bg-red-50 border border-red-100 p-5 rounded-lg">
                  <h3 className="font-bold text-red-700 mb-2">{fail.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="block text-red-800 mb-1">Belirtiler:</strong>
                      <ul className="list-disc list-inside text-slate-700">
                        {fail.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong className="block text-red-800 mb-1">Kök Nedenler:</strong>
                      <ul className="list-disc list-inside text-slate-700">
                        {fail.root_causes.map((rc, i) => <li key={i}>{rc}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-red-100">
                    <strong className="text-red-800 text-xs uppercase tracking-wide">Kontrol Noktaları:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {fail.checks.map((check, i) => (
                         <span key={i} className="bg-white text-red-600 px-2 py-1 rounded text-xs border border-red-100">
                           {check}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Usage & Components */}
        <div className="space-y-6">
          
          {/* Safety */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> Güvenlik Notları
            </h3>
            <ul className="text-sm space-y-2 text-amber-900">
              {module.safety_notes.map((note, idx) => (
                <li key={idx}>• {note}</li>
              ))}
            </ul>
          </div>

          {/* Components */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 mb-3">Tipik Bileşenler</h3>
            <div className="flex flex-wrap gap-2">
              {module.typical_components.map((comp, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                  {comp}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-slate-800 mt-4 mb-3">Örnek Entegre Aileleri</h3>
             <ul className="text-xs text-slate-600 space-y-1 font-mono">
               {module.typical_ic_families.map((ic, idx) => (
                 <li key={idx}>{ic}</li>
               ))}
             </ul>
          </div>

          {/* Used In */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg">
             <h3 className="font-bold text-slate-800 mb-3">Bu Modülü Kullanan Cihazlar</h3>
             {relatedDevices.length > 0 ? (
               <ul className="space-y-2">
                 {relatedDevices.map(dev => (
                   <li key={dev.id}>
                     <Link to={`/devices/${dev.id}`} className="flex items-center text-sm text-accent hover:underline">
                        <Search className="w-3 h-3 mr-2" /> {dev.name}
                     </Link>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-xs text-slate-400">Bu modül henüz bir cihazla ilişkilendirilmemiş.</p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
