import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward, SkipBack, Sliders } from 'lucide-react';

interface ChantingAudioPlayerProps {
  verses: Array<{ verseNumber: number; text: string; meaning?: string }>;
  scriptCode: string;
  onVerseChange?: (verseIndex: number) => void;
}

export const ChantingAudioPlayer: React.FC<ChantingAudioPlayerProps> = ({
  verses,
  scriptCode,
  onVerseChange
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9); // Gentle meditative pace
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update parent when verse changes
  useEffect(() => {
    if (onVerseChange) {
      onVerseChange(currentVerseIndex);
    }
  }, [currentVerseIndex, onVerseChange]);

  const getLanguageTag = (code: string) => {
    switch (code) {
      case 'Deva':
        return 'hi-IN'; // Closest native phonetic match for Sanskrit Devanagari in Web Speech API
      case 'Telu':
        return 'te-IN';
      case 'Taml':
        return 'ta-IN';
      case 'Knda':
        return 'kn-IN';
      case 'Mlym':
        return 'ml-IN';
      case 'Latn':
      default:
        return 'en-IN';
    }
  };

  const playVerse = (index: number) => {
    if (!synthRef.current || verses.length === 0) return;

    synthRef.current.cancel(); // Stop any current chanting

    const targetVerse = verses[index];
    if (!targetVerse) return;

    const utterance = new SpeechSynthesisUtterance(targetVerse.text);
    utterance.lang = getLanguageTag(scriptCode);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best available voice if present
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(getLanguageTag(scriptCode))) ||
                          voices.find(v => v.lang.includes('IN')) ||
                          voices[0];
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (isLooping) {
        playVerse(index);
      } else if (index + 1 < verses.length) {
        setCurrentVerseIndex(index + 1);
        playVerse(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis chanting notice:', e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      playVerse(currentVerseIndex);
    }
  };

  const handlePrevVerse = () => {
    const nextIdx = Math.max(0, currentVerseIndex - 1);
    setCurrentVerseIndex(nextIdx);
    if (isPlaying) {
      playVerse(nextIdx);
    }
  };

  const handleNextVerse = () => {
    const nextIdx = Math.min(verses.length - 1, currentVerseIndex + 1);
    setCurrentVerseIndex(nextIdx);
    if (isPlaying) {
      playVerse(nextIdx);
    }
  };

  const handleRateChange = () => {
    const rates = [0.75, 0.9, 1.1];
    const nextRateIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextRateIndex];
    setPlaybackRate(newRate);
    if (isPlaying) {
      playVerse(currentVerseIndex);
    }
  };

  if (!isSupported || verses.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-stone-900 to-maroon-950 text-white rounded-xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3 border border-gold-500/30">
      
      {/* Left: Indicator & Status */}
      <div className="flex items-center space-x-2.5">
        <div className={`p-2 rounded-lg ${isPlaying ? 'bg-gold-500 text-stone-950 animate-pulse' : 'bg-white/10 text-gold-300'}`}>
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold font-heading flex items-center space-x-1.5">
            <span className="text-gold-200">Sacred Chanting Guide</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-gold-100">
              Verse {currentVerseIndex + 1} of {verses.length}
            </span>
          </div>
          <p className="text-[11px] text-stone-300 font-serif line-clamp-1 max-w-[200px] sm:max-w-xs">
            {verses[currentVerseIndex]?.text.split('\n')[0] || 'Pronunciation Assistant'}
          </p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevVerse}
          disabled={currentVerseIndex === 0}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white"
          title="Previous Verse"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Chant Verse</span>
            </>
          )}
        </button>

        <button
          onClick={handleNextVerse}
          disabled={currentVerseIndex === verses.length - 1}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white"
          title="Next Verse"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Loop & Speed Toggles */}
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 border transition-colors ${
            isLooping
              ? 'bg-gold-500/20 text-gold-300 border-gold-400'
              : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10'
          }`}
          title="Repeat Verse continuously"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Loop</span>
        </button>

        <button
          onClick={handleRateChange}
          className="px-2 py-1 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-gold-200 border border-white/10 flex items-center space-x-1"
          title="Chanting Tempo"
        >
          <Sliders className="w-3 h-3" />
          <span>{playbackRate}x</span>
        </button>
      </div>

    </div>
  );
};
