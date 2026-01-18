// AI Response Parser - Extracts structured blocks from AI-generated content
// Supports: Viral Hooks (emoji markers), Hashtag Engine, Storyboard, Master Prompt

export interface HookVariant {
  type: 'aggressive' | 'intriguing' | 'visual' | 'fear' | 'curiosity' | 'controversy' | 'value' | 'urgency';
  title: string;
  hookText: string;
  retentionForecast: number;
  mechanism: string;
}

export interface ViralHook {
  type: 'fear' | 'curiosity' | 'controversy' | 'value' | 'urgency';
  emoji: string;
  label: string;
  text: string;
}

export interface ParsedHashtags {
  broad: string[];
  niche: string[];
  trending: string[];
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
  viralHooks: ViralHook[];
  hashtags: ParsedHashtags | null;
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

// Block-tag parser for БЛОК 2 - handles [SCENE_START]...[SCENE_END] format
function parseScenes(content: string): StoryboardScene[] {
  const scenes: StoryboardScene[] = [];
  
  console.log('[Parser] Parsing scenes with block-tag format...');
  
  // Find БЛОК 2 section
  const block2Match = content.match(/БЛОК\s*2[:\s]*(?:DIRECTOR['']?S\s*STORYBOARD)?[:\s]*([\s\S]*?)(?=БЛОК\s*3|Copy-Paste|$)/i);
  const storyboardContent = block2Match ? block2Match[1] : content;
  
  // PRIMARY: Split by [SCENE_START] tags
  const sceneBlocks = storyboardContent.split(/\[SCENE_START\]/i).filter(block => block.trim());
  
  console.log(`[Parser] Found ${sceneBlocks.length} scene blocks`);
  
  if (sceneBlocks.length > 0 && storyboardContent.includes('[SCENE_START]')) {
    for (const block of sceneBlocks) {
      // Remove [SCENE_END] tag and clean up
      const cleanBlock = block.replace(/\[SCENE_END\]/gi, '').trim();
      
      if (!cleanBlock) continue;
      
      // Extract each field using tagged format - flexible matching
      const extractField = (fieldName: string): string => {
        // Match FIELD_NAME: content until next field or end
        const regex = new RegExp(
          `${fieldName}[:\\s]+([\\s\\S]*?)(?=(?:SCENE_NUMBER|TIMING|VISUAL|TEXT|SFX|AI_VIDEO_PROMPT)[:\\s]|\\[SCENE_END\\]|$)`,
          'i'
        );
        const match = cleanBlock.match(regex);
        if (match && match[1]) {
          // Clean the extracted content - remove tags and extra whitespace
          return match[1].replace(/\[.*?\]/g, '').trim();
        }
        return '';
      };
      
      const sceneNumber = extractField('SCENE_NUMBER') || `${scenes.length + 1}`;
      const timing = extractField('TIMING') || 'TBD';
      const visual = extractField('VISUAL') || 'TBD';
      const text = extractField('TEXT') || '';
      const sfx = extractField('SFX') || '';
      const aiPrompt = extractField('AI_VIDEO_PROMPT') || 'TBD';
      
      // TEXT goes to audio field
      const audio = text || 'TBD';
      
      const scene: StoryboardScene = {
        scene: parseInt(sceneNumber) || scenes.length + 1,
        timing: timing,
        visual: visual,
        audio: audio,
        sfx: sfx || '—',
        aiPrompt: aiPrompt
      };
      
      console.log(`[Parser] Scene ${scene.scene}:`, { 
        timing: scene.timing, 
        visual: scene.visual.substring(0, 50) + (scene.visual.length > 50 ? '...' : ''),
        audio: scene.audio.substring(0, 50) + (scene.audio.length > 50 ? '...' : '')
      });
      
      scenes.push(scene);
    }
  }
  
  // FALLBACK: Try markdown table parsing if no block-tag scenes found
  if (scenes.length === 0) {
    console.log('[Parser] No block-tag scenes found, trying markdown table fallback...');
    
    const lines = storyboardContent.split('\n');
    const tableRows: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && !trimmed.match(/^\|[\s\-:]+\|$/)) {
        if (trimmed.replace(/\|/g, '').trim().length > 0) {
          tableRows.push(trimmed);
        }
      }
    }
    
    if (tableRows.length > 1) {
      // Skip header row
      for (let i = 1; i < tableRows.length; i++) {
        const cells = tableRows[i].split('|').filter(c => c.trim() !== '');
        if (cells.length >= 4) {
          const firstCell = cleanCell(cells[0]);
          const sceneNumMatch = firstCell.match(/(\d+)/);
          const sceneNum = sceneNumMatch ? parseInt(sceneNumMatch[1]) : scenes.length + 1;
          
          scenes.push({
            scene: sceneNum,
            timing: cells.length > 4 ? cleanCell(cells[1]) : firstCell.replace(/\d+/g, '').trim() || `Scene ${sceneNum}`,
            visual: cleanCell(cells[cells.length > 4 ? 2 : 1]) || 'TBD',
            audio: cleanCell(cells[cells.length > 4 ? 3 : 2]) || 'TBD',
            sfx: cells.length > 5 ? cleanCell(cells[4]) : '—',
            aiPrompt: cleanCell(cells[cells.length - 1]) || 'TBD'
          });
        }
      }
    }
  }
  
  console.log(`[Parser] Total scenes parsed: ${scenes.length}`);
  return scenes;
}

// Parse master prompt from БЛОК 3 or ### 🤖 COPY-PASTE FOR AI AGENT section
function parseMasterPrompt(content: string): MasterPrompt | null {
  // Look for Master Prompt section - various formats
  const block3Patterns = [
    // New format: ### 🤖 COPY-PASTE FOR AI AGENT
    /(?:###?\s*)?🤖\s*(?:COPY-PASTE\s*(?:FOR\s*)?AI\s*AGENT|УНИВЕРСАЛЬНЫЙ\s*ПРОМПТ)[:\s]*([\s\S]+)$/i,
    // Standard БЛОК 3 format
    /БЛОК\s*3[:\s]*[^\n]*\n([\s\S]+)$/i,
    /(?:BLOCK|Block)\s*3[:\s]*[^\n]*\n([\s\S]+)$/i,
    // Other common headers
    /(?:Master[\s\-]*Prompt|God[\s\-]*Prompt|Copy-Paste|Универсальный промпт)[:\s]*\n([\s\S]+)$/i,
    /(?:###?\s*)?(?:AI\s*AGENT|ПРОМПТ\s*ДЛЯ\s*AI)[:\s]*([\s\S]+)$/i,
    // Code blocks
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

// Parse viral hooks with emoji markers (😱, 👀, 💎, 🔥, ⏳)
function parseViralHooks(content: string): ViralHook[] {
  const hooks: ViralHook[] = [];
  
  const emojiMap: { emoji: string; type: ViralHook['type']; label: string }[] = [
    { emoji: '😱', type: 'fear', label: 'Fear' },
    { emoji: '👀', type: 'curiosity', label: 'Curiosity' },
    { emoji: '💎', type: 'value', label: 'Value' },
    { emoji: '🔥', type: 'controversy', label: 'Controversy' },
    { emoji: '⏳', type: 'urgency', label: 'Urgency' },
  ];
  
  for (const { emoji, type, label } of emojiMap) {
    // Match line starting with emoji, capture the rest of the line
    const patterns = [
      new RegExp(`${emoji}[\\s\\-:]*\\[?[^\\]]*\\]?[:\\s]*["«]?([^"»\\n]+)["»]?`, 'gm'),
      new RegExp(`${emoji}[^\\n]+`, 'gm'),
    ];
    
    for (const pattern of patterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        let text = match[1] || match[0].replace(emoji, '').trim();
        // Clean up the text
        text = text
          .replace(/^\[.*?\]\s*/, '') // Remove bracketed labels
          .replace(/^[:\-\s]+/, '')
          .replace(/["«»]/g, '')
          .trim();
        
        if (text.length > 10 && !hooks.find(h => h.type === type)) {
          hooks.push({ type, emoji, label, text });
          break;
        }
      }
      if (hooks.find(h => h.type === type)) break;
    }
  }
  
  return hooks;
}

// Parse hashtags from ### 🏷️ SMART HASHTAG ENGINE section
function parseHashtags(content: string): ParsedHashtags | null {
  const result: ParsedHashtags = { broad: [], niche: [], trending: [] };
  
  // Find hashtag section
  const hashtagPatterns = [
    /(?:###?\s*)?🏷️\s*SMART\s*HASHTAG\s*ENGINE[\s\S]*?(?=###|$)/i,
    /HASHTAG\s*(?:ENGINE|CLOUD)[\s\S]*?(?=###|🤖|COPY-PASTE|$)/i,
    /(?:###?\s*)?(?:Hashtags?|Хэштеги)[\s\S]*?(?=###|🤖|$)/i,
  ];
  
  let hashtagSection = '';
  for (const pattern of hashtagPatterns) {
    const match = content.match(pattern);
    if (match) {
      hashtagSection = match[0];
      break;
    }
  }
  
  if (!hashtagSection) {
    // Try to find any hashtags in the content
    const allHashtags = content.match(/#[\wа-яА-Я]+/g);
    if (allHashtags && allHashtags.length > 0) {
      const uniqueTags = [...new Set(allHashtags.map(t => t.replace('#', '')))];
      result.broad = uniqueTags.slice(0, 5);
      result.niche = uniqueTags.slice(5, 12);
      result.trending = uniqueTags.slice(12, 17);
      return result;
    }
    return null;
  }
  
  // Extract by category
  const categoryPatterns = [
    { key: 'broad' as const, patterns: [/(?:Broad|Широкие|High\s*Volume)[:\s]*([^\n]+(?:\n(?![A-Z]|Niche|Trend|Трендовые).*)*)/i] },
    { key: 'niche' as const, patterns: [/(?:Niche|Нишевые|Targeted)[:\s]*([^\n]+(?:\n(?![A-Z]|Trend|Трендовые).*)*)/i] },
    { key: 'trending' as const, patterns: [/(?:Trend|Трендовые|Algorithm)[:\s]*([^\n]+(?:\n(?![A-Z]).*)*)/i] },
  ];
  
  for (const { key, patterns } of categoryPatterns) {
    for (const pattern of patterns) {
      const match = hashtagSection.match(pattern);
      if (match && match[1]) {
        const tags = match[1].match(/#[\wа-яА-Я0-9]+/g) || [];
        result[key] = tags.map(t => t.replace('#', ''));
        break;
      }
    }
  }
  
  // If no categories found, extract all hashtags
  if (result.broad.length === 0 && result.niche.length === 0 && result.trending.length === 0) {
    const allTags = hashtagSection.match(/#[\wа-яА-Я0-9]+/g) || [];
    const uniqueTags = [...new Set(allTags.map(t => t.replace('#', '')))];
    result.broad = uniqueTags.slice(0, 5);
    result.niche = uniqueTags.slice(5, 12);
    result.trending = uniqueTags.slice(12, 17);
  }
  
  return (result.broad.length > 0 || result.niche.length > 0 || result.trending.length > 0) ? result : null;
}

// Main parser function
export function parseAIResponse(content: string): ParsedAIResponse {
  if (!content || typeof content !== 'string') {
    return {
      hooks: [],
      viralHooks: [],
      hashtags: null,
      scenes: [],
      masterPrompt: null,
      rawContent: '',
      hasStructuredData: false,
    };
  }
  
  console.log('Parsing AI response, length:', content.length);
  
  const hooks = parseHooks(content);
  const viralHooks = parseViralHooks(content);
  const hashtags = parseHashtags(content);
  const scenes = parseScenes(content);
  const masterPrompt = parseMasterPrompt(content);
  
  console.log('Parsed results:', { 
    hooks: hooks.length, 
    viralHooks: viralHooks.length,
    hasHashtags: !!hashtags,
    scenes: scenes.length, 
    hasMasterPrompt: !!masterPrompt 
  });
  
  const hasStructuredData = hooks.length > 0 || viralHooks.length > 0 || hashtags !== null || scenes.length > 0 || masterPrompt !== null;
  
  // If no structured data found but content is long enough, generate demo data
  if (!hasStructuredData && content.length > 100) {
    return {
      hooks: generateDemoHooks(content),
      viralHooks: [],
      hashtags: null,
      scenes: generateDemoScenes(content),
      masterPrompt: generateDemoMasterPrompt(content),
      rawContent: content,
      hasStructuredData: true,
    };
  }
  
  return {
    hooks,
    viralHooks,
    hashtags,
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
