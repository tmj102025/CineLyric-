export interface Scene {
  id: string;
  lyricSegment: string;
  visualPrompt: string; // The specific action/setting for this scene
  fullPrompt?: string; // Character + Visual + Style
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

export interface CharacterProfile {
  name: string;
  description: string; // Physical appearance
  style: string; // Cinematic style (e.g., Cyberpunk, Vintage, Noir)
}

export enum AppStep {
  LYRICS_INPUT = 0,
  CHARACTER_DESIGN = 1,
  STORYBOARD_REVIEW = 2,
  GENERATION_GALLERY = 3,
}

export interface AnalysisResponse {
  characterArchetype: string;
  scenes: {
    lyric_segment: string;
    visual_description: string;
    mood: string;
  }[];
}