import React from 'react';
import { Link } from 'react-router-dom';
import { MODULES } from '../data';
import { ArrowRight } from 'lucide-react';

const ModuleLibrary = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Modül Kütüphanesi</h1>
        <p className="text-slate-600 mt-2">
          Modern ev elektroniğinde tekrar eden yapı taşları (Building Blocks). 
          Bir cihazı analiz ederken bu modülleri tespit etmek, karmaşıklığı yönetilebilir parçalara böler.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(module => (
          <Link key={module.id} to={`/modules/${module.id}`} className="group block h-full">
            <div className="bg-white border border-slate-200 rounded-xl p-6 h-full hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary text-white font-mono text-lg font-bold px-3 py-1 rounded-md shadow-sm">
                  {module.id}
                </span>
                <ArrowRight className="text-slate-300 group-hover:text-accent transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-accent transition-colors">
                {module.name}
              </h2>
              <p className="text-slate-600 text-sm mb-4 flex-grow">
                {module.summary}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">
                  {module.topologies.length} Topoloji
                </span>
                <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded border border-red-100">
                  {module.failure_modes.length} Arıza Tipi
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModuleLibrary;
