import React, { useState, useCallback } from 'react';
import { analyzeLyrics, generateSceneImage } from './services/geminiService';
import { AppStep, Scene, CharacterProfile } from './types';
import { StepIndicator } from './components/StepIndicator';
import { LyricsInput } from './components/LyricsInput';
import { CharacterDesign } from './components/CharacterDesign';
import { Storyboard } from './components/Storyboard';
import { Gallery } from './components/Gallery';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LYRICS_INPUT);
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState<CharacterProfile>({ name: '', description: '', style: '' });
  const [scenes, setScenes] = useState<Scene[]>([]);
  
  // Step 1: Analyze Lyrics
  const handleLyricsSubmit = async (lyrics: string) => {
    setLoading(true);
    try {
      const result = await analyzeLyrics(lyrics);
      
      // Transform API response to state
      const newScenes: Scene[] = result.scenes.map((s, idx) => ({
        id: `scene-${Date.now()}-${idx}`,
        lyricSegment: s.lyric_segment,
        visualPrompt: `${s.visual_description} (Mood: ${s.mood})`,
        status: 'pending'
      }));

      setScenes(newScenes);
      // Pre-fill character description from analysis
      setCharacter(prev => ({ ...prev, description: result.characterArchetype }));
      setCurrentStep(AppStep.CHARACTER_DESIGN);
    } catch (error) {
      alert("วิเคราะห์เนื้อเพลงไม่สำเร็จ กรุณาตรวจสอบ API Key หรือลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Character
  const handleCharacterConfirm = (profile: CharacterProfile) => {
    setCharacter(profile);
    setCurrentStep(AppStep.STORYBOARD_REVIEW);
  };

  // Step 3: Update Scene Prompt
  const handleUpdateScene = (id: string, newPrompt: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, visualPrompt: newPrompt } : s));
  };

  // Step 4: Start Generation Process
  const handleStartGeneration = async () => {
    setCurrentStep(AppStep.GENERATION_GALLERY);
    setLoading(true);

    // Process scenes sequentially to avoid rate limits and allow user to see progress
    // Clone scenes to avoid direct mutation in loop
    const scenesToProcess = [...scenes];

    for (let i = 0; i < scenesToProcess.length; i++) {
        const scene = scenesToProcess[i];
        if (scene.status === 'completed') continue;

        // Update status to generating
        setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'generating' } : s));

        try {
            const imageUrl = await generateSceneImage(scene, character);
            setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'completed', imageUrl } : s));
        } catch (error) {
            console.error(`Error generating scene ${i}:`, error);
            setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'error' } : s));
        }
    }
    setLoading(false);
  };

  // Regenerate single image
  const handleRegenerate = async (id: string) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;

    setScenes(prev => prev.map(s => s.id === id ? { ...s, status: 'generating' } : s));
    
    try {
        const imageUrl = await generateSceneImage(scene, character);
        setScenes(prev => prev.map(s => s.id === id ? { ...s, status: 'completed', imageUrl } : s));
    } catch (error) {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, status: 'error' } : s));
    }
  };

  const handleDownloadAll = useCallback(() => {
    // Filter only completed scenes with images
    const validScenes = scenes.filter(s => s.status === 'completed' && s.imageUrl);
    
    validScenes.forEach((scene, index) => {
      // Create a delay to prevent browser from blocking multiple downloads
      // Increased delay to 800ms for better stability with 20+ files
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = scene.imageUrl!;
        // Naming convention: 01.png, 02.png, etc.
        const fileName = `${String(index + 1).padStart(2, '0')}.png`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 800); 
    });
  }, [scenes]);

  return (
    <div className="min-h-screen bg-cinema-900 text-cinema-text font-sans selection:bg-cinema-accent selection:text-white pb-10">
      
      {/* Header */}
      <header className="border-b border-cinema-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-cinema-accent rounded flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
               </svg>
             </div>
             <h1 className="text-xl font-bold tracking-tight text-white">CineLyric <span className="text-cinema-dim font-normal">สร้าง MV (20+ Scenes)</span></h1>
          </div>
          {process.env.API_KEY ? (
             <span className="text-xs text-green-500 font-mono">เชื่อมต่อ API แล้ว</span>
          ) : (
            <span className="text-xs text-red-500 font-mono">ไม่พบ API KEY</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === AppStep.LYRICS_INPUT && (
            <LyricsInput onSubmit={handleLyricsSubmit} isLoading={loading} />
          )}

          {currentStep === AppStep.CHARACTER_DESIGN && (
            <CharacterDesign 
              initialDescription={character.description} 
              onConfirm={handleCharacterConfirm} 
            />
          )}

          {currentStep === AppStep.STORYBOARD_REVIEW && (
            <Storyboard 
              scenes={scenes} 
              onUpdateScene={handleUpdateScene}
              onProceed={handleStartGeneration}
            />
          )}

          {currentStep === AppStep.GENERATION_GALLERY && (
            <Gallery 
              scenes={scenes} 
              isGenerating={loading} 
              onRegenerate={handleRegenerate}
              onDownloadAll={handleDownloadAll}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;