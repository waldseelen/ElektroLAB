import React from 'react';
import { MODULES } from '../data';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

const TopologyAtlas = () => {
  // Aggregate topologies from all modules
  const allTopologies = MODULES.flatMap(m => m.topologies.map(t => ({ ...t, moduleId: m.id, moduleName: m.name })));

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Topoloji Atlası</h1>
        <p className="text-slate-600 mt-2">
          Güç elektroniği ve sinyal işlemede kullanılan standart devre yapıları.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {allTopologies.map((topo, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
             <div className="flex items-start justify-between mb-4">
               <div>
                 <h2 className="text-xl font-bold text-primary">{topo.name}</h2>
                 <Link to={`/modules/${topo.moduleId}`} className="text-xs text-accent hover:underline flex items-center mt-1">
                   {topo.moduleId}: {topo.moduleName} <ArrowRight className="w-3 h-3 ml-1" />
                 </Link>
               </div>
               <Activity className="text-slate-200 w-8 h-8" />
             </div>
             
             <p className="text-slate-600 mb-4 text-sm">{topo.notes}</p>

             <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <span className="font-bold text-emerald-700 block mb-1">Avantajlar</span>
                  <ul className="list-disc list-inside text-emerald-800">
                    {topo.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-100">
                  <span className="font-bold text-red-700 block mb-1">Dezavantajlar</span>
                  <ul className="list-disc list-inside text-red-800">
                    {topo.cons.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopologyAtlas;
