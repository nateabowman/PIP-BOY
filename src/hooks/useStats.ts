import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../utils/formatters';

export interface StatsData {
  time: string;
  date: string;
  steps: number;
  calories: number;
  heartRate?: number;
  sleepHours?: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<StatsData>({
    time: formatTime(),
    date: formatDate(),
    steps: 0,
    calories: 0
  });

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        time: formatTime(),
        date: formatDate()
      }));
    }, 1000);

    // Try to get step count from device motion (if available)
    let stepCount = 0;
    let lastAcceleration = 0;
    let stepThreshold = 0.5;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.acceleration?.x && event.acceleration?.y && event.acceleration?.z) {
        const acceleration = Math.sqrt(
          Math.pow(event.acceleration.x, 2) +
          Math.pow(event.acceleration.y, 2) +
          Math.pow(event.acceleration.z, 2)
        );

        if (acceleration - lastAcceleration > stepThreshold) {
          stepCount++;
          setStats(prev => ({
            ...prev,
            steps: stepCount,
            calories: Math.round(stepCount * 0.04) // Rough estimate: 0.04 calories per step
          }));
        }

        lastAcceleration = acceleration;
      }
    };

    // Request device motion permission
    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(() => {
          // Permission denied or not available
        });
    } else if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
    }

    // Load saved steps from localStorage
    const savedSteps = localStorage.getItem('pipboy-steps');
    if (savedSteps) {
      const parsed = JSON.parse(savedSteps);
      stepCount = parsed.count || 0;
      setStats(prev => ({
        ...prev,
        steps: stepCount,
        calories: Math.round(stepCount * 0.04)
      }));
    }

    // Save steps periodically
    const saveInterval = setInterval(() => {
      localStorage.setItem('pipboy-steps', JSON.stringify({ count: stepCount }));
    }, 60000); // Save every minute

    return () => {
      clearInterval(timeInterval);
      clearInterval(saveInterval);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return stats;
};

