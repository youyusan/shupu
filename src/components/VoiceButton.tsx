'use client';

import { useState, useEffect, useCallback } from 'react';

interface VoiceButtonProps {
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export function VoiceButton({ onTextChange, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = (window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    }).SpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: new () => unknown;
    }).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const handleRecord = useCallback(() => {
    const SpeechRecognition = (window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    }).SpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: new () => unknown;
    }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition() as unknown as {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((event: { resultIndex: number; results: { length: number; [key: number]: { isFinal: boolean; [key: number]: { transcript: string } } } }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    let silenceTimer: ReturnType<typeof setTimeout> | null = null;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const newTranscript = transcript + finalTranscript + interimTranscript;
      setTranscript(newTranscript);
      onTextChange(newTranscript);

      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
      }, 3000);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    setIsRecording(true);
    recognition.start();
  }, [onTextChange, transcript]);

  const handleStop = useCallback(() => {
    const SpeechRecognition = (window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    }).SpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: new () => unknown;
    }).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as unknown as { stop: () => void };
      recognition.stop();
    }
    setIsRecording(false);
  }, []);

  if (!isSupported) return null;

  return (
    <button
      onClick={isRecording ? handleStop : handleRecord}
      disabled={disabled}
      className={`
        p-3 rounded-full transition-all duration-300
        ${isRecording 
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
          : 'bg-surface text-text-muted hover:bg-border hover:text-text'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={isRecording ? '停止录音' : '语音输入'}
    >
      {isRecording ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
        </svg>
      )}
    </button>
  );
}