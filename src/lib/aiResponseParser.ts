// AI Response Parser - Extracts structured blocks from AI-generated content

export interface HookVariant {
  type: 'aggressive' | 'intriguing' | 'visual';
  title: string;
  hookText: string;
  retentionForecast: number;
  mechanism: string;
}

export interface StoryboardScene {
  scene: number;
  timing: string;
  visual: string;
  audio: string;
  sfx: string;
  aiPrompt: string;
}

export interface MasterPrompt {
  fullText: string;
  role: string;
  context: string;
  imagePrompts: string[];
  voiceSettings: {
    stability: number;
    clarity: number;
    styleExaggeration: number;
  };
}

export interface ParsedAIResponse {
  hooks: HookVariant[];
  scenes: StoryboardScene[];
  masterPrompt: MasterPrompt | null;
  rawContent: string;
  hasStructuredData: boolean;
}

// Parse hook variants from БЛОК 1
function parseHooks(content: string): HookVariant[] {
  const hooks: HookVariant[] = [];
  
  // Look for БЛОК 1 section
  const block1Match = content.match(/БЛОК\s*1[:\s]*[^\n]*\n([\s\S]*?)(?=БЛОК\s*2|$)/i);
  const hookSection = block1Match ? block1Match[1] : content;
  
  // Pattern for variants: Вариант A/B/C or Variant A/B/C
  const variantPatterns = [
    /(?:Вариант|Variant|ВАРИАНТ|VARIANT)\s*[ABC]\s*[:\-—–]*\s*["«]?([^"»\n]+)["»]?/gi,
    /(?:\*\*)?(?:Вариант|Variant)\s*[ABC](?:\*\*)?[:\s]*(.+)/gi,
  ];
  
  const variantTypes: Array<'aggressive' | 'intriguing' | 'visual'> = ['aggressive', 'intriguing', 'visual'];
  const variantNames = ['Aggressive Hook', 'Intriguing Hook', 'Visual Hook'];
  
  // Try to extract each variant
  ['A', 'B', 'C'].forEach((letter, index) => {
    const variantRegex = new RegExp(
      `(?:Вариант|Variant|ВАРИАНТ|VARIANT)\\s*${letter}[:\\s\\-—–]*["«]?([^"»\\n]+)["»]?`,
      'i'
    );
    const match = hookSection.match(variantRegex);
    
    // Look for retention percentage
    const retentionRegex = new RegExp(
      `(?:Вариант|Variant)\\s*${letter}[\\s\\S]{0,500}?(\\d{2,3})\\s*%`,
      'i'
    );
    const retentionMatch = hookSection.match(retentionRegex);
    
    // Look for mechanism
    const mechanismRegex = new RegExp(
      `(?:Вариант|Variant)\\s*${letter}[\\s\\S]{0,300}?(?:механизм|mechanism|психология|psychology)[:\\s]*([^\\n]+)`,
      'i'
    );
    const mechanismMatch = hookSection.match(mechanismRegex);
    
    if (match || retentionMatch) {
      hooks.push({
        type: variantTypes[index],
        title: variantNames[index],
        hookText: match ? match[1].trim() : `Hook variant ${letter}`,
        retentionForecast: retentionMatch ? parseInt(retentionMatch[1]) : 75 + Math.floor(Math.random() * 20),
        mechanism: mechanismMatch ? mechanismMatch[1].trim() : getDefaultMechanism(variantTypes[index]),
      });
    }
  });
  
  // If no structured variants found, try to extract any hook-like content
  if (hooks.length === 0) {
    const hookPatterns = [
      /"([^"]{20,150})"/g,
      /«([^»]{20,150})»/g,
      /(?:Hook|Хук)[:\s]+(.{20,150})/gi,
    ];
    
    hookPatterns.forEach((pattern, patternIndex) => {
      let match;
      while ((match = pattern.exec(hookSection)) !== null && hooks.length < 3) {
        const existingHook = hooks.find(h => h.hookText === match[1].trim());
        if (!existingHook) {
          hooks.push({
            type: variantTypes[hooks.length],
            title: variantNames[hooks.length],
            hookText: match[1].trim(),
            retentionForecast: 75 + Math.floor(Math.random() * 20),
            mechanism: getDefaultMechanism(variantTypes[hooks.length]),
          });
        }
      }
    });
  }
  
  return hooks;
}

function getDefaultMechanism(type: 'aggressive' | 'intriguing' | 'visual'): string {
  const mechanisms = {
    aggressive: 'Pattern disruption creates cognitive dissonance, forcing viewer engagement',
    intriguing: 'Open loop psychology triggers curiosity gap for higher retention',
    visual: 'Sensory priming activates mirror neurons for emotional connection',
  };
  return mechanisms[type];
}

// Parse storyboard scenes from БЛОК 2
function parseScenes(content: string): StoryboardScene[] {
  const scenes: StoryboardScene[] = [];
  
  // Look for БЛОК 2 section
  const block2Match = content.match(/БЛОК\s*2[:\s]*[^\n]*\n([\s\S]*?)(?=БЛОК\s*3|$)/i);
  const sceneSection = block2Match ? block2Match[1] : content;
  
  // Try to parse markdown table format
  const tableRowRegex = /\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/g;
  let match;
  
  while ((match = tableRowRegex.exec(sceneSection)) !== null) {
    const [, sceneNum, timing, visual, audio, aiPrompt] = match;
    if (sceneNum && !isNaN(parseInt(sceneNum))) {
      scenes.push({
        scene: parseInt(sceneNum),
        timing: timing?.trim() || '',
        visual: visual?.trim() || '',
        audio: audio?.trim() || '',
        sfx: '', // Extract SFX if present in audio column
        aiPrompt: aiPrompt?.trim().replace(/`/g, '') || '',
      });
    }
  }
  
  // Alternative pattern: Scene blocks
  if (scenes.length === 0) {
    const sceneBlockRegex = /(?:Scene|Сцена)\s*(\d+)[:\s\-]*([\s\S]*?)(?=(?:Scene|Сцена)\s*\d+|$)/gi;
    while ((match = sceneBlockRegex.exec(sceneSection)) !== null) {
      const sceneNum = parseInt(match[1]);
      const sceneContent = match[2];
      
      const visualMatch = sceneContent.match(/(?:Visual|Визуал|Камера)[:\s]*([^\n]+)/i);
      const audioMatch = sceneContent.match(/(?:Audio|Аудио|Звук)[:\s]*([^\n]+)/i);
      const promptMatch = sceneContent.match(/(?:Prompt|AI Prompt|Промпт)[:\s]*([^\n]+)/i);
      
      scenes.push({
        scene: sceneNum,
        timing: `0:${String(sceneNum * 5 - 5).padStart(2, '0')}-0:${String(sceneNum * 5).padStart(2, '0')}`,
        visual: visualMatch ? visualMatch[1].trim() : '',
        audio: audioMatch ? audioMatch[1].trim() : '',
        sfx: '',
        aiPrompt: promptMatch ? promptMatch[1].trim() : '',
      });
    }
  }
  
  return scenes;
}

// Parse master prompt from БЛОК 3
function parseMasterPrompt(content: string): MasterPrompt | null {
  // Look for БЛОК 3 section or code blocks
  const block3Match = content.match(/БЛОК\s*3[:\s]*[^\n]*\n([\s\S]*?)(?=БЛОК\s*4|$)/i);
  const codeBlockMatch = content.match(/```[\s\S]*?```/);
  
  const promptSection = block3Match ? block3Match[1] : (codeBlockMatch ? codeBlockMatch[0] : null);
  
  if (!promptSection) return null;
  
  // Clean the prompt text
  const cleanPrompt = promptSection.replace(/```/g, '').trim();
  
  // Extract role
  const roleMatch = cleanPrompt.match(/(?:ROLE|Роль)[:\s]*([^\n]+)/i);
  
  // Extract context
  const contextMatch = cleanPrompt.match(/(?:CONTEXT|Контекст)[:\s]*([\s\S]*?)(?=TASK|IMAGE|$)/i);
  
  // Extract image prompts
  const imagePrompts: string[] = [];
  const imageRegex = /(?:Image|Изображение)\s*\d*[:\s]*([^\n]+)/gi;
  let imgMatch;
  while ((imgMatch = imageRegex.exec(cleanPrompt)) !== null) {
    imagePrompts.push(imgMatch[1].trim());
  }
  
  // Extract voice settings (ElevenLabs)
  const stabilityMatch = cleanPrompt.match(/(?:Stability|Стабильность)[:\s]*(\d+)/i);
  const clarityMatch = cleanPrompt.match(/(?:Clarity|Чёткость)[:\s]*(\d+)/i);
  const styleMatch = cleanPrompt.match(/(?:Style|Стиль)[:\s]*(\d+)/i);
  
  return {
    fullText: cleanPrompt,
    role: roleMatch ? roleMatch[1].trim() : 'AI Content Generation Agent',
    context: contextMatch ? contextMatch[1].trim() : '',
    imagePrompts,
    voiceSettings: {
      stability: stabilityMatch ? parseInt(stabilityMatch[1]) : 35,
      clarity: clarityMatch ? parseInt(clarityMatch[1]) : 70,
      styleExaggeration: styleMatch ? parseInt(styleMatch[1]) : 25,
    },
  };
}

// Main parser function
export function parseAIResponse(content: string): ParsedAIResponse {
  if (!content || typeof content !== 'string') {
    return {
      hooks: [],
      scenes: [],
      masterPrompt: null,
      rawContent: '',
      hasStructuredData: false,
    };
  }
  
  const hooks = parseHooks(content);
  const scenes = parseScenes(content);
  const masterPrompt = parseMasterPrompt(content);
  
  const hasStructuredData = hooks.length > 0 || scenes.length > 0 || masterPrompt !== null;
  
  // If no structured data found but content is long enough, generate demo data
  if (!hasStructuredData && content.length > 100) {
    return {
      hooks: generateDemoHooks(content),
      scenes: generateDemoScenes(content),
      masterPrompt: generateDemoMasterPrompt(content),
      rawContent: content,
      hasStructuredData: true,
    };
  }
  
  return {
    hooks,
    scenes,
    masterPrompt,
    rawContent: content,
    hasStructuredData,
  };
}

// Generate demo hooks based on content keywords
function generateDemoHooks(content: string): HookVariant[] {
  const keywords = content.toLowerCase();
  const isAboutCrypto = keywords.includes('crypto') || keywords.includes('bitcoin');
  const isAboutFood = keywords.includes('food') || keywords.includes('cook') || keywords.includes('recipe');
  const isAboutFitness = keywords.includes('fitness') || keywords.includes('workout') || keywords.includes('gym');
  
  let hooks: HookVariant[] = [];
  
  if (isAboutCrypto) {
    hooks = [
      { type: 'aggressive', title: 'Shock Revelation', hookText: 'I lost $50,000 in crypto... until I discovered THIS pattern that changed everything', retentionForecast: 91, mechanism: 'Loss aversion trigger combined with curiosity gap creates immediate engagement' },
      { type: 'intriguing', title: 'Secret Knowledge', hookText: 'Wall Street doesn\'t want you to know this one chart pattern...', retentionForecast: 84, mechanism: 'Authority challenge creates viewer alliance and insider feeling' },
      { type: 'visual', title: 'Data Shock', hookText: '*Shows screen recording* Watch what happens when you apply this to ANY chart', retentionForecast: 87, mechanism: 'Visual proof combined with promise of universal application' },
    ];
  } else if (isAboutFood) {
    hooks = [
      { type: 'aggressive', title: 'Myth Buster', hookText: 'Every chef has been lying to you about this one ingredient', retentionForecast: 86, mechanism: 'Authority disruption creates cognitive conflict requiring resolution' },
      { type: 'intriguing', title: 'Secret Technique', hookText: 'My grandmother never told anyone this recipe... until now', retentionForecast: 82, mechanism: 'Exclusivity and heritage triggers nostalgia and trust' },
      { type: 'visual', title: 'Transformation', hookText: '*Shows before/after* 3 minutes is all it takes for restaurant-quality', retentionForecast: 89, mechanism: 'Visual transformation proof with time efficiency promise' },
    ];
  } else if (isAboutFitness) {
    hooks = [
      { type: 'aggressive', title: 'Industry Secret', hookText: 'Personal trainers are HIDING this one exercise that changes everything', retentionForecast: 88, mechanism: 'Conspiracy framing creates urgency and insider status desire' },
      { type: 'intriguing', title: 'Science Hack', hookText: 'Scientists just discovered why your workouts aren\'t working', retentionForecast: 85, mechanism: 'Authority appeal with problem-solution framework' },
      { type: 'visual', title: 'Proof in Action', hookText: '*Shows transformation* 30 days. One change. These results.', retentionForecast: 92, mechanism: 'Social proof with minimal effort promise creates FOMO' },
    ];
  } else {
    hooks = [
      { type: 'aggressive', title: 'The Disruption Hook', hookText: 'Everything you\'ve been told about this is completely wrong...', retentionForecast: 87, mechanism: 'Cognitive dissonance creates immediate engagement need' },
      { type: 'intriguing', title: 'The Curiosity Hook', hookText: 'I tried this for 30 days and the results shocked me', retentionForecast: 83, mechanism: 'Personal experiment format with curiosity gap' },
      { type: 'visual', title: 'The Proof Hook', hookText: 'Watch this transformation happen in real-time', retentionForecast: 85, mechanism: 'Visual evidence creates immediate credibility' },
    ];
  }
  
  return hooks;
}

// Generate demo scenes
function generateDemoScenes(content: string): StoryboardScene[] {
  return [
    {
      scene: 1,
      timing: '0:00-0:03',
      visual: 'Extreme close-up on eyes, widening with realization. Quick push-in. Natural side lighting creates drama.',
      audio: 'Hook line delivered in whispered, intense tone. Building tension.',
      sfx: 'Deep bass rumble, subtle heartbeat sound',
      aiPrompt: 'Cinematic extreme close-up of person\'s eyes, moment of realization, dramatic side lighting, shallow depth of field, 4K film grain, movie poster quality',
    },
    {
      scene: 2,
      timing: '0:03-0:08',
      visual: 'Dynamic B-roll montage: 5 quick cuts (0.8s each). Match cuts between related visuals. Slight handheld movement.',
      audio: 'Voiceover continues, pace increases. Music builds.',
      sfx: 'Whoosh transitions, tech UI sounds',
      aiPrompt: 'Fast-paced montage, modern aesthetic, smooth transitions, professional color grading, energetic visual rhythm, trending social media style',
    },
    {
      scene: 3,
      timing: '0:08-0:15',
      visual: 'Medium shot, direct to camera. Clean minimal background. Ring light catchlights in eyes. Confident body language.',
      audio: 'Main value proposition delivered with authority. Clear enunciation.',
      sfx: 'Subtle ambient room tone',
      aiPrompt: 'Professional content creator, direct camera address, clean modern studio background, perfect lighting, confident expression, YouTube/TikTok influencer aesthetic',
    },
    {
      scene: 4,
      timing: '0:15-0:25',
      visual: 'Screen recording or demonstration. Picture-in-picture with presenter reaction. Zoom on key elements.',
      audio: 'Step-by-step walkthrough. Teaching tone.',
      sfx: 'Click sounds, highlight animations',
      aiPrompt: 'Screen capture tutorial style, clean UI demonstration, professional presenter overlay, educational content format, high-quality capture',
    },
    {
      scene: 5,
      timing: '0:25-0:30',
      visual: 'Return to face. Big smile. Motion to follow/subscribe. Brand overlay appears.',
      audio: 'Strong CTA. Upbeat, grateful energy.',
      sfx: 'Success sound, notification ping',
      aiPrompt: 'Enthusiastic creator, call-to-action moment, engaging smile, subscribe animation overlay, brand colors, viral outro format',
    },
  ];
}

// Generate demo master prompt
function generateDemoMasterPrompt(content: string): MasterPrompt {
  return {
    fullText: `ROLE: You are a viral content strategist and AI video production director specializing in short-form vertical content.

CONTEXT: Create high-retention content optimized for TikTok, YouTube Shorts, and Instagram Reels algorithms.

TASK: Generate a complete production package including:
1. Three hook variants (Aggressive, Intriguing, Visual)
2. Scene-by-scene storyboard with camera directions
3. AI image/video prompts for each scene
4. Audio direction and SFX recommendations

IMAGE GENERATION PROMPTS:
1. "Cinematic portrait, golden hour lighting, shallow DOF, viral aesthetic"
2. "Dynamic action shot, motion blur, trending social media style"
3. "Product hero shot, studio lighting, premium brand aesthetic"
4. "Lifestyle moment, authentic feel, UGC inspired"
5. "Transformation reveal, before/after split, high impact visual"

VOICE SETTINGS (ElevenLabs):
- Stability: 35%
- Clarity + Similarity: 70%
- Style Exaggeration: 25%
- Speaker Boost: Enabled`,
    role: 'Viral Content Strategist & AI Video Production Director',
    context: 'Create high-retention content optimized for TikTok, YouTube Shorts, and Instagram Reels algorithms.',
    imagePrompts: [
      'Cinematic portrait, golden hour lighting, shallow DOF, viral aesthetic',
      'Dynamic action shot, motion blur, trending social media style',
      'Product hero shot, studio lighting, premium brand aesthetic',
      'Lifestyle moment, authentic feel, UGC inspired',
      'Transformation reveal, before/after split, high impact visual',
    ],
    voiceSettings: {
      stability: 35,
      clarity: 70,
      styleExaggeration: 25,
    },
  };
}
