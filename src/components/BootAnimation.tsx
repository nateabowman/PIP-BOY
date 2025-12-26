import React, { useState, useEffect, useRef } from 'react';
import { usePipBoy } from '../context/PipBoyContext';
import { usePipBoySounds } from '../hooks/usePipBoySounds';

const BootAnimation: React.FC = () => {
  const { setBootComplete } = usePipBoy();
  const { playBoot } = usePipBoySounds();
  const [bootText, setBootText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (!hasPlayedSound.current) {
      playBoot();
      hasPlayedSound.current = true;
    }
    
    const bootSequence = [
      'ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM',
      'COPYRIGHT 2075-2077 ROBCO INDUSTRIES',
      '-SERVER 1-',
      '',
      '> INITIALIZING...',
      '> LOADING PIP-BOY OS...',
      '> SYSTEM CHECK...',
      '> MEMORY TEST: OK',
      '> DISPLAY TEST: OK',
      '> AUDIO TEST: OK',
      '',
      '> PIP-BOY READY',
      '',
      'PRESS ANY KEY TO CONTINUE...'
    ];

    let currentLine = 0;
    let currentChar = 0;
    let displayText = '';

    const typeInterval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        const line = bootSequence[currentLine];
        
        // Handle empty lines
        if (line.length === 0) {
          displayText += '\n';
          setBootText(displayText);
          currentLine++;
          currentChar = 0;
        } else if (currentChar < line.length) {
          displayText += line[currentChar];
          setBootText(displayText);
          currentChar++;
        } else {
          displayText += '\n';
          setBootText(displayText);
          currentLine++;
          currentChar = 0;
        }
        
        // Check if we've completed all lines
        if (currentLine >= bootSequence.length) {
          clearInterval(typeInterval);
          setShowContent(true);
        }
      } else {
        clearInterval(typeInterval);
        setShowContent(true);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []); // Empty dependency array - only run once

  const handleClick = () => {
    if (showContent) {
      setBootComplete(true);
    }
  };

  if (!showContent) {
    return (
      <div className="boot-animation" onClick={handleClick}>
        <div className="boot-text">
          {bootText}
          <span className="boot-typing">|</span>
        </div>
      </div>
    );
  }

  return (
    <div className="boot-animation" onClick={handleClick}>
      <div className="boot-text">
        {bootText}
        <br />
        <br />
        <div className="glow-pulse">CLICK TO START</div>
      </div>
    </div>
  );
};

export default BootAnimation;

