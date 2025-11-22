import React, { useState } from 'react';
import { Scene } from '../types';

interface Props {
  scenes: Scene[];
  onUpdateScene: (id: string, newPrompt: string) => void;
  onProceed: () => void;
}

export const Storyboard: React.FC<Props> = ({ scenes, onUpdateScene, onProceed }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrompt, setTempPrompt] = useState('');

  const startEdit = (scene: Scene) => {
    setEditingId(scene.id);
    setTempPrompt(scene.visualPrompt);
  };

  const saveEdit = (id: string) => {
    onUpdateScene(id, tempPrompt);
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-24">
       <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">ตรวจสอบสตอรี่บอร์ด</h2>
          <p className="text-cinema-dim">
            นี่คือฉากที่วิเคราะห์ได้จากเนื้อเพลง คุณสามารถแก้ไขคำบรรยายภาพได้ตามต้องการ
          </p>
        </div>
        <button
          onClick={onProceed}
          className="px-6 py-3 bg-cinema-accent hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all hidden md:block"
        >
          เริ่มสร้างภาพ
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scenes.map((scene, index) => (
          <div key={scene.id} className="bg-cinema-800 p-5 rounded-lg border border-cinema-700 flex flex-col md:flex-row gap-4">
            
            {/* Scene Number */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-cinema-900 border border-cinema-700 text-cinema-dim font-mono font-bold">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-grow space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cinema-accent">เนื้อร้อง</span>
                <p className="text-white font-serif italic text-lg">"{scene.lyricSegment}"</p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cinema-dim">คำบรรยายภาพ (Prompt)</span>
                {editingId === scene.id ? (
                  <div className="mt-1 flex gap-2">
                    <textarea
                      className="w-full bg-cinema-900 text-white p-3 rounded border border-cinema-accent outline-none"
                      value={tempPrompt}
                      onChange={(e) => setTempPrompt(e.target.value)}
                      rows={2}
                    />
                    <button onClick={() => saveEdit(scene.id)} className="px-4 bg-green-600 rounded text-white text-sm font-bold">บันทึก</button>
                  </div>
                ) : (
                  <div 
                    onClick={() => startEdit(scene)}
                    className="mt-1 text-cinema-dim hover:text-white cursor-pointer border border-transparent hover:border-cinema-700 p-2 rounded -ml-2 transition-colors"
                  >
                    {scene.visualPrompt}
                    <span className="ml-2 text-xs opacity-50 text-cinema-accent">(คลิกเพื่อแก้ไข)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-cinema-900/90 backdrop-blur-md border-t border-cinema-700 p-4 md:hidden flex justify-center z-50">
        <button
          onClick={onProceed}
          className="w-full max-w-xs px-6 py-3 bg-cinema-accent text-white font-bold rounded-lg shadow-lg"
        >
          เริ่มสร้างภาพ ({scenes.length} ฉาก)
        </button>
      </div>
    </div>
  );
};