import React from 'react';
import { GLOSSARY } from '../data';

interface RichTextProps {
  text: string;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ text, className = "" }) => {
  // Sort glossary terms by length (descending) to match longer phrases first
  const sortedTerms = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length);

  // Create a regex pattern that matches any of the glossary terms (case insensitive)
  const pattern = new RegExp(`\\b(${sortedTerms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  const parts = text.split(pattern);

  return (
    <span className={`leading-relaxed whitespace-pre-line ${className}`}>
      {parts.map((part, index) => {
        const glossaryItem = sortedTerms.find(t => t.term.toLowerCase() === part.toLowerCase());

        if (glossaryItem) {
          return (
            <span key={index} className="relative group cursor-help inline-block">
              <span className="text-accent font-medium border-b border-dashed border-accent/50 group-hover:border-accent transition-colors">
                {part}
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-left font-sans">
                <div className="font-bold text-accent mb-1 border-b border-slate-700 pb-1">{glossaryItem.term}</div>
                <div className="text-slate-300 leading-snug">{glossaryItem.definition}</div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
              </div>
            </span>
          );
        }
        
        // Parse Markdown Bold (**text**)
        const subParts = part.split(/(\*\*.*?\*\*)/g);
        return subParts.map((subPart, subIndex) => {
          if (subPart.startsWith('**') && subPart.endsWith('**')) {
            return <strong key={`${index}-${subIndex}`} className="font-bold text-slate-800">{subPart.slice(2, -2)}</strong>;
          }
          return <span key={`${index}-${subIndex}`}>{subPart}</span>;
        });
      })}
    </span>
  );
};

export default RichText;