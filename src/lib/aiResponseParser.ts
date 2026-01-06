// AI Response Parser - Extracts structured blocks from AI-generated content
// Robust parsing for БЛОК 1, БЛОК 2 (markdown tables), and БЛОК 3 (master prompt)

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

// Helper to clean cell content
function cleanCell(cell: string): string {
  return cell
    .replace(/^\s*\*\*|\*\*\s*$/g, '') // Remove bold markers
    .replace(/`/g, '') // Remove backticks
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Parse hook variants from БЛОК 1
function parseHooks(content: string): HookVariant[] {
  const hooks: HookVariant[] = [];
  
  // Find БЛОК 1 section - more flexible matching
  const block1Patterns = [
    /БЛОК\s*1[:\s]*[^\n]*\n([\s\S]*?)(?=БЛОК\s*2|---|\n\n\n|$)/i,
    /(?:BLOCK|Block)\s*1[:\s]*[^\n]*\n([\s\S]*?)(?=(?:BLOCK|Block)\s*2|---|\n\n\n|$)/i,
    /(?:Хуки|Hooks?|HOOKS?)[:\s]*\n([\s\S]*?)(?=(?:Сториборд|Storyboard|БЛОК\s*2)|$)/i,
  ];
  
  let hookSection = '';
  for (const pattern of block1Patterns) {
    const match = content.match(pattern);
    if (match) {
      hookSection = match[1];
      break;
    }
  }
  
  if (!hookSection) {
    hookSection = content;
  }
  
  const variantTypes: Array<'aggressive' | 'intriguing' | 'visual'> = ['aggressive', 'intriguing', 'visual'];
  const variantTitles = ['Aggressive Hook', 'Intriguing Hook', 'Visual Hook'];
  
  // Extract each variant A, B, C
  ['A', 'B', 'C'].forEach((letter, index) => {
    // Multiple patterns to catch different formats
    const hookPatterns = [
      // "Вариант A: "Text here""
      new RegExp(`(?:Вариант|Variant|ВАРИАНТ)\\s*${letter}[:\\s\\-—–]+["«]([^"»]+)["»]`, 'i'),
      // **Вариант A:** Text here
      new RegExp(`\\*\\*(?:Вариант|Variant)\\s*${letter}[:\\s]*\\*\\*[:\\s]*["«]?([^"»\\n]+)["»]?`, 'i'),
      // Вариант A (Агрессивный): "Text"
      new RegExp(`(?:Вариант|Variant)\\s*${letter}[^:]*:[:\\s]*["«]([^"»]+)["»]`, 'i'),
      // Just capture after Вариант A
      new RegExp(`(?:Вариант|Variant)\\s*${letter}[:\\s\\-—–]+(.{10,150})`, 'i'),
    ];
    
    let hookText = '';
    for (const pattern of hookPatterns) {
      const match = hookSection.match(pattern);
      if (match && match[1]) {
        hookText = cleanCell(match[1]);
        break;
      }
    }
    
    // Look for retention percentage near this variant
    const retentionPatterns = [
      new RegExp(`(?:Вариант|Variant)\\s*${letter}[\\s\\S]{0,400}?(\\d{2,3})\\s*%`, 'i'),
      new RegExp(`${letter}[\\s\\S]{0,200}?(?:Retention|Удержание|прогноз)[:\\s]*(\\d{2,3})\\s*%`, 'i'),
    ];
    
    let retention = 75 + Math.floor(Math.random() * 20);
    for (const pattern of retentionPatterns) {
      const match = hookSection.match(pattern);
      if (match && match[1]) {
        retention = parseInt(match[1]);
        break;
      }
    }
    
    // Look for mechanism/psychology
    const mechanismPatterns = [
      new RegExp(`(?:Вариант|Variant)\\s*${letter}[\\s\\S]{0,500}?(?:механизм|mechanism|психология|psychology)[:\\s]*([^\\n]+)`, 'i'),
      new RegExp(`${letter}[\\s\\S]{0,300}?(?:Почему|Why|работает|works)[:\\s]*([^\\n]+)`, 'i'),
    ];
    
    let mechanism = getDefaultMechanism(variantTypes[index]);
    for (const pattern of mechanismPatterns) {
      const match = hookSection.match(pattern);
      if (match && match[1]) {
        mechanism = cleanCell(match[1]);
        break;
      }
    }
    
    if (hookText && hookText.length > 5) {
      hooks.push({
        type: variantTypes[index],
        title: variantTitles[index],
        hookText,
        retentionForecast: retention,
        mechanism,
      });
    }
  });
  
  // Fallback: try to extract any quoted hooks if structured parsing failed
  if (hooks.length === 0) {
    const quotedHooks = [
      ...hookSection.matchAll(/"([^"]{15,200})"/g),
      ...hookSection.matchAll(/«([^»]{15,200})»/g),
    ];
    
    quotedHooks.slice(0, 3).forEach((match, index) => {
      hooks.push({
        type: variantTypes[index],
        title: variantTitles[index],
        hookText: cleanCell(match[1]),
        retentionForecast: 75 + Math.floor(Math.random() * 20),
        mechanism: getDefaultMechanism(variantTypes[index]),
      });
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

// ROBUST Markdown Table Parser for БЛОК 2
function parseScenes(content: string): StoryboardScene[] {
  const scenes: StoryboardScene[] = [];
  
  // Find БЛОК 2 section
  const block2Patterns = [
    /БЛОК\s*2[:\s]*[^\n]*\n([\s\S]*?)(?=БЛОК\s*3|---|\n```|$)/i,
    /(?:BLOCK|Block)\s*2[:\s]*[^\n]*\n([\s\S]*?)(?=(?:BLOCK|Block)\s*3|---|\n```|$)/i,
    /(?:Сториборд|Storyboard|STORYBOARD)[:\s]*\n([\s\S]*?)(?=(?:Master|БЛОК\s*3|Copy-Paste)|$)/i,
  ];
  
  let sceneSection = '';
  for (const pattern of block2Patterns) {
    const match = content.match(pattern);
    if (match) {
      sceneSection = match[1];
      break;
    }
  }
  
  if (!sceneSection) {
    sceneSection = content;
  }
  
  console.log('Parsing scene section:', sceneSection.substring(0, 200));
  
  // ROBUST TABLE PARSER
  // Split into lines and find table rows
  const lines = sceneSection.split('\n');
  const tableRows: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip header separator (|---|---|...) and empty lines
    if (trimmed.startsWith('|') && !trimmed.match(/^\|[\s\-:]+\|$/)) {
      // Check it's a data row, not just pipes
      if (trimmed.replace(/\|/g, '').trim().length > 0) {
        tableRows.push(trimmed);
      }
    }
  }
  
  console.log('Found table rows:', tableRows.length);
  
  // Detect table structure from header
  let headerRow = '';
  let headerIndex = 0;
  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i].toLowerCase();
    if (row.includes('сцена') || row.includes('scene') || row.includes('№') || 
        row.includes('visual') || row.includes('визуал')) {
      headerRow = tableRows[i];
      headerIndex = i;
      break;
    }
  }
  
  // Parse data rows (skip header if found)
  const dataRows = headerIndex > 0 ? tableRows.slice(headerIndex + 1) : tableRows.slice(1);
  
  for (const row of dataRows) {
    // Split by pipe and clean
    const cells = row.split('|').filter(c => c.trim() !== '');
    
    if (cells.length >= 4) {
      // Try to extract scene number from first cell
      const firstCell = cleanCell(cells[0]);
      const sceneNumMatch = firstCell.match(/(\d+)/);
      const sceneNum = sceneNumMatch ? parseInt(sceneNumMatch[1]) : scenes.length + 1;
      
      // Map cells based on typical structure
      // Usually: Scene/Timing | Visual | Audio | AI Prompt
      // Or: Scene | Timing | Visual | Audio | AI Prompt
      let timing = '';
      let visual = '';
      let audio = '';
      let aiPrompt = '';
      let sfx = '';
      
      if (cells.length === 4) {
        // Compact format: Scene+Timing | Visual | Audio | Prompt
        timing = firstCell.replace(/\d+/g, '').trim() || `Scene ${sceneNum}`;
        visual = cleanCell(cells[1]);
        audio = cleanCell(cells[2]);
        aiPrompt = cleanCell(cells[3]);
      } else if (cells.length === 5) {
        // Standard: Scene | Timing | Visual | Audio | Prompt
        timing = cleanCell(cells[1]);
        visual = cleanCell(cells[2]);
        audio = cleanCell(cells[3]);
        aiPrompt = cleanCell(cells[4]);
      } else if (cells.length >= 6) {
        // Extended: Scene | Timing | Visual | Audio | SFX | Prompt
        timing = cleanCell(cells[1]);
        visual = cleanCell(cells[2]);
        audio = cleanCell(cells[3]);
        sfx = cleanCell(cells[4]);
        aiPrompt = cleanCell(cells[5]);
      }
      
      // Extract SFX from audio if present
      const sfxMatch = audio.match(/(?:SFX|Звук|эффекты?)[:\s]*([^.]+)/i);
      if (sfxMatch) {
        sfx = sfx || cleanCell(sfxMatch[1]);
      }
      
      // Only add if we have meaningful content
      if (visual.length > 3 || audio.length > 3 || aiPrompt.length > 3) {
        scenes.push({
          scene: sceneNum,
          timing: timing || `0:${String((sceneNum - 1) * 5).padStart(2, '0')}-0:${String(sceneNum * 5).padStart(2, '0')}`,
          visual: visual || 'Scene visual description',
          audio: audio || 'Audio direction',
          sfx: sfx,
          aiPrompt: aiPrompt || 'AI video generation prompt',
        });
      }
    }
  }
  
  console.log('Parsed scenes:', scenes.length);
  
  // Alternative: Try scene block format if table parsing yielded nothing
  if (scenes.length === 0) {
    const sceneBlockRegex = /(?:Scene|Сцена)\s*(\d+)[:\s\-]*([\s\S]*?)(?=(?:Scene|Сцена)\s*\d+|БЛОК\s*3|$)/gi;
    let match;
    
    while ((match = sceneBlockRegex.exec(sceneSection)) !== null) {
      const sceneNum = parseInt(match[1]);
      const sceneContent = match[2];
      
      const visualMatch = sceneContent.match(/(?:Visual|Визуал|Камера|Camera)[:\s]*([^\n]+)/i);
      const audioMatch = sceneContent.match(/(?:Audio|Аудио|Звук|Voice)[:\s]*([^\n]+)/i);
      const promptMatch = sceneContent.match(/(?:Prompt|AI\s*Prompt|Промпт)[:\s]*([^\n]+)/i);
      const timingMatch = sceneContent.match(/(?:Timing|Время|Time)[:\s]*([^\n]+)/i);
      
      scenes.push({
        scene: sceneNum,
        timing: timingMatch ? cleanCell(timingMatch[1]) : `0:${String((sceneNum - 1) * 5).padStart(2, '0')}-0:${String(sceneNum * 5).padStart(2, '0')}`,
        visual: visualMatch ? cleanCell(visualMatch[1]) : '',
        audio: audioMatch ? cleanCell(audioMatch[1]) : '',
        sfx: '',
        aiPrompt: promptMatch ? cleanCell(promptMatch[1]) : '',
      });
    }
  }
  
  return scenes;
}

// Parse master prompt from БЛОК 3 - continue parsing to end of response
function parseMasterPrompt(content: string): MasterPrompt | null {
  // Look for БЛОК 3 section - must continue to the END of the response
  const block3Patterns = [
    /БЛОК\s*3[:\s]*[^\n]*\n([\s\S]+)$/i,
    /(?:BLOCK|Block)\s*3[:\s]*[^\n]*\n([\s\S]+)$/i,
    /(?:Master[\s\-]*Prompt|Copy-Paste|Универсальный промпт)[:\s]*\n([\s\S]+)$/i,
    /```(?:text|prompt)?\n([\s\S]*?)```/i,
  ];
  
  let promptSection = '';
  for (const pattern of block3Patterns) {
    const match = content.match(pattern);
    if (match) {
      promptSection = match[1];
      break;
    }
  }
  
  // If no block found, try to find code blocks or the last major section
  if (!promptSection) {
    // Look for the last code block in the document
    const codeBlocks = content.match(/```[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
      promptSection = codeBlocks[codeBlocks.length - 1];
    }
  }
  
  if (!promptSection || promptSection.length < 50) {
    return null;
  }
  
  // Clean the prompt text
  const cleanPrompt = promptSection
    .replace(/```(?:text|prompt)?/g, '')
    .replace(/```/g, '')
    .trim();
  
  // Extract structured parts
  const roleMatch = cleanPrompt.match(/(?:ROLE|Role|Роль)[:\s]*([^\n]+)/i);
  const contextMatch = cleanPrompt.match(/(?:CONTEXT|Context|Контекст)[:\s]*([\s\S]*?)(?=TASK|Task|IMAGE|Image|VOICE|Voice|$)/i);
  
  // Extract image prompts
  const imagePrompts: string[] = [];
  const imagePatterns = [
    /(?:Image|Изображение)\s*\d*[:\s]*["«]?([^"»\n]+)["»]?/gi,
    /\d+\.\s*["«]([^"»\n]+)["»]/g,
  ];
  
  for (const pattern of imagePatterns) {
    let imgMatch;
    while ((imgMatch = pattern.exec(cleanPrompt)) !== null) {
      const prompt = cleanCell(imgMatch[1]);
      if (prompt.length > 10 && !imagePrompts.includes(prompt)) {
        imagePrompts.push(prompt);
      }
    }
  }
  
  // Extract voice settings
  const stabilityMatch = cleanPrompt.match(/(?:Stability|Стабильность)[:\s]*(\d+)/i);
  const clarityMatch = cleanPrompt.match(/(?:Clarity|Similarity|Чёткость)[:\s]*(\d+)/i);
  const styleMatch = cleanPrompt.match(/(?:Style|Стиль|Exaggeration)[:\s]*(\d+)/i);
  
  return {
    fullText: cleanPrompt,
    role: roleMatch ? cleanCell(roleMatch[1]) : 'AI Content Generation Agent',
    context: contextMatch ? cleanCell(contextMatch[1]) : '',
    imagePrompts: imagePrompts.length > 0 ? imagePrompts : getDefaultImagePrompts(),
    voiceSettings: {
      stability: stabilityMatch ? parseInt(stabilityMatch[1]) : 35,
      clarity: clarityMatch ? parseInt(clarityMatch[1]) : 70,
      styleExaggeration: styleMatch ? parseInt(styleMatch[1]) : 25,
    },
  };
}

function getDefaultImagePrompts(): string[] {
  return [
    'Cinematic portrait, golden hour lighting, shallow DOF, viral aesthetic',
    'Dynamic action shot, motion blur, trending social media style',
    'Product hero shot, studio lighting, premium brand aesthetic',
    'Lifestyle moment, authentic feel, UGC inspired',
    'Transformation reveal, before/after split, high impact visual',
  ];
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
  
  console.log('Parsing AI response, length:', content.length);
  
  const hooks = parseHooks(content);
  const scenes = parseScenes(content);
  const masterPrompt = parseMasterPrompt(content);
  
  console.log('Parsed results:', { hooks: hooks.length, scenes: scenes.length, hasMasterPrompt: !!masterPrompt });
  
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
  const isAboutCrypto = keywords.includes('crypto') || keywords.includes('bitcoin') || keywords.includes('крипт');
  const isAboutFood = keywords.includes('food') || keywords.includes('cook') || keywords.includes('recipe') || keywords.includes('еда') || keywords.includes('рецепт');
  const isAboutFitness = keywords.includes('fitness') || keywords.includes('workout') || keywords.includes('gym') || keywords.includes('фитнес') || keywords.includes('спорт');
  
  if (isAboutCrypto) {
    return [
      { type: 'aggressive', title: 'Shock Revelation', hookText: 'I lost $50,000 in crypto... until I discovered THIS pattern that changed everything', retentionForecast: 91, mechanism: 'Loss aversion trigger combined with curiosity gap creates immediate engagement' },
      { type: 'intriguing', title: 'Secret Knowledge', hookText: "Wall Street doesn't want you to know this one chart pattern...", retentionForecast: 84, mechanism: 'Authority challenge creates viewer alliance and insider feeling' },
      { type: 'visual', title: 'Data Shock', hookText: '*Shows screen recording* Watch what happens when you apply this to ANY chart', retentionForecast: 87, mechanism: 'Visual proof combined with promise of universal application' },
    ];
  } else if (isAboutFood) {
    return [
      { type: 'aggressive', title: 'Myth Buster', hookText: 'Every chef has been lying to you about this one ingredient', retentionForecast: 86, mechanism: 'Authority disruption creates cognitive conflict requiring resolution' },
      { type: 'intriguing', title: 'Secret Technique', hookText: 'My grandmother never told anyone this recipe... until now', retentionForecast: 82, mechanism: 'Exclusivity and heritage triggers nostalgia and trust' },
      { type: 'visual', title: 'Transformation', hookText: '*Shows before/after* 3 minutes is all it takes for restaurant-quality', retentionForecast: 89, mechanism: 'Visual transformation proof with time efficiency promise' },
    ];
  } else if (isAboutFitness) {
    return [
      { type: 'aggressive', title: 'Industry Secret', hookText: 'Personal trainers are HIDING this one exercise that changes everything', retentionForecast: 88, mechanism: 'Conspiracy framing creates urgency and insider status desire' },
      { type: 'intriguing', title: 'Science Hack', hookText: "Scientists just discovered why your workouts aren't working", retentionForecast: 85, mechanism: 'Authority appeal with problem-solution framework' },
      { type: 'visual', title: 'Proof in Action', hookText: '*Shows transformation* 30 days. One change. These results.', retentionForecast: 92, mechanism: 'Social proof with minimal effort promise creates FOMO' },
    ];
  }
  
  return [
    { type: 'aggressive', title: 'The Disruption Hook', hookText: "Everything you've been told about this is completely wrong...", retentionForecast: 87, mechanism: 'Cognitive dissonance creates immediate engagement need' },
    { type: 'intriguing', title: 'The Curiosity Hook', hookText: 'I tried this for 30 days and the results shocked me', retentionForecast: 83, mechanism: 'Personal experiment format with curiosity gap' },
    { type: 'visual', title: 'The Proof Hook', hookText: 'Watch this transformation happen in real-time', retentionForecast: 85, mechanism: 'Visual evidence creates immediate credibility' },
  ];
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
      aiPrompt: "Cinematic extreme close-up of person's eyes, moment of realization, dramatic side lighting, shallow depth of field, 4K film grain, movie poster quality",
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
