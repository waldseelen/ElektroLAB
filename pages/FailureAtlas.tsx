import React, { useState } from 'react';
import { DEVICES } from '../data';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle } from 'lucide-react';

const FailureAtlas = () => {
  const [filter, setFilter] = useState('');

  // Flatten all failure scenarios from all devices
  const allFailures = DEVICES.flatMap(d => 
    d.failure_scenarios.map(f => ({ ...f, deviceName: d.name, deviceId: d.id }))
  );

  const filteredFailures = allFailures.filter(f => 
    f.title.toLowerCase().includes(filter.toLowerCase()) ||
    f.symptoms.some(s => s.toLowerCase().includes(filter.toLowerCase())) ||
    f.deviceName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Arıza Atlası</h1>
        <p className="text-slate-600 mt-2">
          Semptomdan çözüme giden yol. Gerçek hayatta karşılaşılan arıza senaryolarının kütüphanesi.
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Semptom veya arıza ara (örn: ısınmıyor, ses var görüntü yok)..." 
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-accent outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFailures.map((fail, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-grow">
               <div className="flex items-center gap-2 mb-2">
                 <Link to={`/devices/${fail.deviceId}`} className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">
                   {fail.deviceName}
                 </Link>
                 <span className="text-xs text-red-500 font-bold border border-red-100 px-2 py-1 rounded bg-red-50">
                    {fail.likely_modules[0]}
                 </span>
               </div>
               <h3 className="text-lg font-bold text-slate-800">{fail.title}</h3>
               <div className="mt-2 text-sm text-slate-600">
                 <strong className="text-slate-800">Semptomlar:</strong> {fail.symptoms.join(", ")}
               </div>
               <div className="mt-2 text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">
                 {fail.notes}
               </div>
            </div>
            
            <div className="md:w-64 flex-shrink-0 bg-slate-50 p-4 rounded border border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Olası Parçalar</div>
              <ul className="space-y-1">
                {fail.likely_components.map((comp, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-center">
                    <AlertTriangle className="w-3 h-3 text-warning mr-2" />
                    {comp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {filteredFailures.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
            Aradığınız kriterde arıza kaydı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default FailureAtlas;
