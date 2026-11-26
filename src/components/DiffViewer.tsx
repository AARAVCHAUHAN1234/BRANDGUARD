import React from 'react';

interface DiffViewerProps {
  original: string;
  suggested: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ original, suggested }) => {
  return (
    <div className="font-mono text-xs border border-[#D8D5CE] bg-[#FFFFFF]">
      <div className="bg-[#F7F6F2] px-3 py-1.5 border-b border-[#D8D5CE] text-[10px] font-mono uppercase tracking-wider text-[#73716B] flex items-center justify-between">
        <span>REDLINE // MINIMAL CORRECTION</span>
        <span className="text-[#8C6228]">PROVENANCE BOUND</span>
      </div>
      <div className="p-3 space-y-2 leading-relaxed">
        <div className="flex items-start gap-2 bg-[#F8EBE9] text-[#9B382B] px-2.5 py-1.5 border-l-2 border-[#9B382B]">
          <span className="select-none font-bold text-[#9B382B] shrink-0 font-mono">−</span>
          <span className="line-through opacity-85 break-words font-sans text-xs">{original}</span>
        </div>
        <div className="flex items-start gap-2 bg-[#EEF4EF] text-[#2D5A38] px-2.5 py-1.5 border-l-2 border-[#2D5A38]">
          <span className="select-none font-bold text-[#2D5A38] shrink-0 font-mono">+</span>
          <span className="break-words font-sans text-xs font-medium text-[#171717]">{suggested}</span>
        </div>
      </div>
    </div>
  );
};