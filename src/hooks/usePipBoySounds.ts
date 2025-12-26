import { useRef, useEffect } from 'react';
import { usePipBoy } from '../context/PipBoyContext';

export const usePipBoySounds = () => {
  const { settings } = usePipBoy();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playSound = (frequency: number, duration: number = 0.1, type: OscillatorType = 'square') => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    const volume = settings.volume * 0.1;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playClick = () => {
    playSound(800, 0.05, 'square');
  };

  const playTabSwitch = () => {
    playSound(600, 0.1, 'square');
    setTimeout(() => playSound(800, 0.1, 'square'), 50);
  };

  const playBoot = () => {
    playSound(200, 0.2, 'sawtooth');
    setTimeout(() => playSound(400, 0.2, 'sawtooth'), 200);
    setTimeout(() => playSound(600, 0.3, 'sawtooth'), 400);
  };

  const playNotification = () => {
    playSound(1000, 0.15, 'sine');
    setTimeout(() => playSound(1200, 0.15, 'sine'), 150);
  };

  const playError = () => {
    playSound(300, 0.2, 'sawtooth');
    setTimeout(() => playSound(200, 0.2, 'sawtooth'), 200);
  };

  return {
    playClick,
    playTabSwitch,
    playBoot,
    playNotification,
    playError
  };
};

