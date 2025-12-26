export const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(2)} lbs`;
};

export const formatValue = (value: number): string => {
  return `${value.toFixed(0)} caps`;
};

export const formatPercentage = (value: number, max: number): string => {
  if (max === 0) return '0%';
  return `${Math.round((value / max) * 100)}%`;
};

export const formatBattery = (level: number): string => {
  return `${Math.round(level * 100)}%`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
};

