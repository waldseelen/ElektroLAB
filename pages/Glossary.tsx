import React, { useState, useMemo } from 'react';
import { GLOSSARY } from '../data';
import { Search, BookOpen, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Alphabet for filtering
  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredTerms = useMemo(() => {
    return GLOSSARY.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter 
        ? (selectedLetter === '#' ? /^\d/.test(item.term) : item.term.toUpperCase().startsWith(selectedLetter))
        : true;
      
      return matchesSearch && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedLetter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-accent" />
          Teknik Terimler Sözlüğü
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Elektronik ve mühendislik jargonuna hakim olun.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Terim veya açıklama ara..." 
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Alphabet Filter */}
        <div className="flex flex-wrap gap-1 justify-center">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1 text-sm rounded transition-colors ${selectedLetter === null ? 'bg-primary text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Tümü
          </button>
          {alphabet.map(char => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${selectedLetter === char ? 'bg-accent text-white font-bold' : 'bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent'}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-accent transition-colors">
                {term.term}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {term.definition}
              </p>
              
              {term.related_ids.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {term.related_ids.map(id => (
                    <Link 
                      key={id} 
                      to={id.startsWith('M') ? `/modules/${id}` : `/devices/${id}`}
                      className="inline-flex items-center text-xs font-mono bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-200 hover:border-accent hover:text-accent transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {id}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            Aradığınız kriterlere uygun terim bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;