import React, { useEffect, useRef } from 'react';
import { animateNumber } from '../utils/animations';

interface StatDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  animate?: boolean;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, unit, animate = false }) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef<number | string>(value);

  useEffect(() => {
    if (valueRef.current) {
      if (animate && typeof value === 'number' && typeof prevValueRef.current === 'number') {
        animateNumber(valueRef.current, prevValueRef.current as number, value, 500);
      } else {
        valueRef.current.textContent = typeof value === 'number' ? value.toString() : value.toString();
        if (unit) {
          valueRef.current.textContent += ` ${unit}`;
        }
      }
    }
    prevValueRef.current = value;
  }, [value, animate, unit]);

  return (
    <div className="stat-display">
      <div className="stat-label">{label}</div>
      <div className="stat-value" ref={valueRef}>
        {!animate && typeof value === 'number' ? value.toString() : value.toString()}
        {!animate && unit && ` ${unit}`}
      </div>
    </div>
  );
};

export default StatDisplay;

