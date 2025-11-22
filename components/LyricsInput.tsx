import React, { useState } from 'react';

interface Props {
  onSubmit: (lyrics: string) => void;
  isLoading: boolean;
}

export const LyricsInput: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [lyrics, setLyrics] = useState('');

  const handleSubmit = () => {
    if (!lyrics.trim()) return;
    onSubmit(lyrics);
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fadeIn">
      <h2 className="text-3xl font-bold mb-4 text-center">ใส่เนื้อเพลง</h2>
      <p className="text-cinema-dim text-center mb-8">
        วางเนื้อเพลงของคุณที่นี่ AI จะวิเคราะห์เพื่อสร้างสตอรี่บอร์ดภาพให้โดยอัตโนมัติ
      </p>
      
      <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700 shadow-xl">
        <textarea
          className="w-full h-64 bg-cinema-900 text-white p-4 rounded-lg border border-cinema-700 focus:border-cinema-accent focus:ring-1 focus:ring-cinema-accent outline-none transition-all resize-none font-mono text-sm leading-relaxed"
          placeholder="วางเนื้อเพลงที่นี่..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          disabled={isLoading}
        ></textarea>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!lyrics.trim() || isLoading}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95
              ${
                !lyrics.trim() || isLoading
                  ? 'bg-cinema-700 text-cinema-dim cursor-not-allowed'
                  : 'bg-cinema-accent hover:bg-red-700 shadow-lg shadow-red-900/20'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังวิเคราะห์...
              </span>
            ) : (
              'วิเคราะห์เนื้อเพลง'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};