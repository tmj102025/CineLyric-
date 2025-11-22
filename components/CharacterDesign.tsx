import React, { useState, useEffect } from 'react';
import { CharacterProfile } from '../types';

interface Props {
  initialDescription: string;
  onConfirm: (profile: CharacterProfile) => void;
}

export const CharacterDesign: React.FC<Props> = ({ initialDescription, onConfirm }) => {
  const [profile, setProfile] = useState<CharacterProfile>({
    name: 'Protagonist',
    description: 'หญิงสาวชาวเอเชีย รูปร่างสมส่วน ผิวขาวเนียนละเอียด ผมสีดำยาวสลวย ใบหน้าสวยงามตามแบบฉบับพิมพ์นิยม (V-shape face), ดวงตากลมโตมีเสน่ห์, จมูกโด่งได้รูป, แต่งหน้าโทนธรรมชาติ (Natural Look). **เน้น: ต้องเป็นคนเดิม หน้าเดิม เป๊ะทุกมุม**',
    style: 'Cinematic, 35mm film look, shallow depth of field, moody lighting, photorealistic 8k, color graded like a movie',
  });

  useEffect(() => {
    if (initialDescription) {
      setProfile(prev => ({ ...prev, description: initialDescription }));
    }
  }, [initialDescription]);

  const handleChange = (field: keyof CharacterProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fadeIn">
      <h2 className="text-3xl font-bold mb-2 text-center">ออกแบบตัวละครหลัก (นางเอก MV)</h2>
      <p className="text-cinema-dim text-center mb-8">
        เรากำหนดให้เป็นหญิงสาวชาวเอเชียเพื่อความสมจริงสูงสุด คุณสามารถปรับแต่งรายละเอียดเพิ่มเติมได้
      </p>

      <div className="bg-cinema-800 p-8 rounded-xl border border-cinema-700 shadow-xl space-y-6">
        
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-cinema-dim mb-2">โทนภาพและแสง (Cinematic Tone)</label>
          <select 
            value={profile.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full bg-cinema-900 border border-cinema-700 text-white rounded-lg p-3 focus:border-cinema-accent outline-none"
          >
            <option value="Cinematic, 35mm film look, shallow depth of field, moody lighting, photorealistic 8k">ภาพยนตร์ดราม่า (Cinematic Realistic)</option>
            <option value="Wong Kar-Wai style, neon lights, motion blur, film grain, vintage 90s hk">หว่อง กาไว (Neon & Vintage)</option>
            <option value="Korean Drama aesthetic, soft natural lighting, bright, romantic, sharp focus">ซีรีส์เกาหลี (K-Drama Bright)</option>
            <option value="Dark mood, low key lighting, mystery, thriller atmosphere, cold tones">โทนมืด ลึกลับ (Dark & Moody)</option>
            <option value="Dreamy, ethereal, soft glow, pastel colors, fantasy romance">ชวนฝัน แฟนตาซี (Dreamy Soft)</option>
          </select>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-cinema-dim mb-2">ลักษณะนางเอก (Character Appearance)</label>
          <p className="text-xs text-cinema-dim mb-2 italic">
            *ระบบจะล็อกใบหน้าให้คงที่ที่สุด กรุณาระบุจุดเด่น เช่น ทรงผม หรือการแต่งตัว
          </p>
          <textarea
            className="w-full h-32 bg-cinema-900 text-white p-4 rounded-lg border border-cinema-700 focus:border-cinema-accent outline-none resize-none"
            value={profile.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="ระบุรายละเอียด..."
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-cinema-700 mt-4">
           <div className="text-xs text-cinema-dim max-w-md">
             * ระบบจะสร้างภาพอย่างต่ำ 20 ฉาก และคัดเลือกมุมกล้องที่หลากหลาย (Wide, Close-up, Drone) ให้อัตโนมัติ
           </div>
           <button
            onClick={() => onConfirm(profile)}
            className="px-8 py-3 bg-cinema-accent hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-all"
          >
            ยืนยันตัวละคร
          </button>
        </div>
      </div>
    </div>
  );
};