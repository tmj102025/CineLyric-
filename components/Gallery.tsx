import React, { useEffect, useRef } from 'react';
import { Scene } from '../types';

interface Props {
  scenes: Scene[];
  isGenerating: boolean;
  onRegenerate: (id: string) => void;
  onDownloadAll: () => void;
}

export const Gallery: React.FC<Props> = ({ scenes, isGenerating, onRegenerate, onDownloadAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the latest generated image
  useEffect(() => {
    if (isGenerating && scrollRef.current) {
        // Simple auto-scroll logic if needed
    }
  }, [scenes, isGenerating]);

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn pb-24">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-cinema-900/95 backdrop-blur z-40 py-4 border-b border-cinema-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">แกลเลอรีผลงาน</h2>
          <p className="text-sm text-cinema-dim">
            {isGenerating 
              ? `กำลังสร้างภาพ... กรุณารอสักครู่ (ใช้โมเดล Nano Banana)` 
              : `สร้างเสร็จสิ้น ได้รูปภาพทั้งหมด ${scenes.filter(s => s.status === 'completed').length} รูป`}
          </p>
        </div>
        {!isGenerating && scenes.some(s => s.status === 'completed') && (
           <button
           onClick={onDownloadAll}
           className="px-4 py-2 bg-cinema-700 hover:bg-white hover:text-black text-white font-medium rounded transition-all text-sm"
         >
           ดาวน์โหลดทั้งหมด
         </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={scrollRef}>
        {scenes.map((scene, index) => (
          <div key={scene.id} className="group relative bg-black rounded-lg overflow-hidden border border-cinema-800 shadow-2xl">
            {/* Image Container - 16:9 Aspect Ratio */}
            <div className="relative w-full aspect-video bg-cinema-800 flex items-center justify-center overflow-hidden">
              {scene.status === 'completed' && scene.imageUrl ? (
                <img 
                  src={scene.imageUrl} 
                  alt={scene.visualPrompt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : scene.status === 'generating' ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-cinema-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-cinema-accent animate-pulse font-mono text-sm">กำลังสร้างภาพที่ {index + 1}...</span>
                </div>
              ) : scene.status === 'error' ? (
                <div className="flex flex-col items-center text-red-500 p-4 text-center">
                   <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   <span>การสร้างล้มเหลว</span>
                </div>
              ) : (
                <span className="text-cinema-dim font-mono text-xs">รอคิว</span>
              )}

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <p className="text-white font-serif italic text-lg mb-2">"{scene.lyricSegment}"</p>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => onRegenerate(scene.id)}
                      disabled={isGenerating}
                      className="px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs rounded backdrop-blur"
                    >
                      สร้างใหม่ (Regenerate)
                    </button>
                    {scene.imageUrl && (
                      <a 
                        href={scene.imageUrl} 
                        download={`scene-${index+1}.png`}
                        className="px-3 py-1 bg-cinema-accent hover:bg-red-600 text-white text-xs rounded"
                      >
                        ดาวน์โหลด
                      </a>
                    )}
                 </div>
              </div>
            </div>
            
            {/* Status Bar for mobile/always visible */}
            <div className="p-4 border-t border-cinema-800 bg-cinema-900">
                <div className="flex justify-between items-start">
                    <div className="text-cinema-dim text-xs font-mono mb-1">ฉากที่ {index + 1}</div>
                    <div className={`w-2 h-2 rounded-full ${
                        scene.status === 'completed' ? 'bg-green-500' :
                        scene.status === 'generating' ? 'bg-yellow-500 animate-pulse' :
                        scene.status === 'error' ? 'bg-red-500' : 'bg-cinema-700'
                    }`}></div>
                </div>
                <p className="text-cinema-dim text-sm line-clamp-2">{scene.visualPrompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};