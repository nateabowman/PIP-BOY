import React, { useState, useRef, useEffect } from 'react';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';

interface Station {
  id: string;
  name: string;
  url: string;
  genre?: string;
}

const RadioTab: React.FC = () => {
  const { playClick } = usePipBoySounds();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Real radio stations - using free internet radio streams
  // Note: Some stations may have CORS restrictions. These streams are publicly available.
  // If a station doesn't work, it may be due to browser CORS policies or the stream being down.
  const stations: Station[] = [
    { 
      id: '1', 
      name: 'Radio Paradise', 
      url: 'https://stream.radioparadise.com/mp3-128',
      genre: 'Eclectic Mix'
    },
    { 
      id: '2', 
      name: 'SomaFM: Groove Salad', 
      url: 'https://ice1.somafm.com/groovesalad-128-mp3',
      genre: 'Ambient/Chill'
    },
    { 
      id: '3', 
      name: 'Classical MPR', 
      url: 'https://cms.stream.publicradio.org/cms.mp3',
      genre: 'Classical'
    },
    { 
      id: '4', 
      name: 'Jazz Radio', 
      url: 'https://jazz-wr05.ice.infomaniak.ch/jazz-wr05-128.mp3',
      genre: 'Jazz'
    },
    { 
      id: '5', 
      name: 'Chillout Lounge', 
      url: 'https://streams.radiobob.de/bob-chillout/mp3-192/mediaplayer',
      genre: 'Chillout'
    },
    { 
      id: '6', 
      name: 'SomaFM: Def Con', 
      url: 'https://ice1.somafm.com/defcon-128-mp3',
      genre: 'Electronic'
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setLoading(false);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      setIsPlaying(false);
      setLoading(false);
      const audio = e.target as HTMLAudioElement;
      let errorMsg = 'Failed to load station.';
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Playback aborted.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error. Check your connection.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Decode error. Try another station.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Format not supported or CORS blocked.';
            break;
        }
      }
      setError(errorMsg);
      playClick();
    };

    const handleLoadStart = () => {
      setLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentStation, playClick]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error('Play error:', err);
        setError('Unable to play. Some browsers require user interaction first.');
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentStation]);

  const handlePlayPause = () => {
    playClick();
    if (!currentStation) {
      setCurrentStation(stations[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStationSelect = (station: Station) => {
    playClick();
    setCurrentStation(station);
    setIsPlaying(true);
    setError(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="tab-content fade-in">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div className="stat-value" style={{ marginBottom: '10px' }}>
          {currentStation?.name || 'NO STATION SELECTED'}
        </div>
        {currentStation?.genre && (
          <div className="stat-label" style={{ marginBottom: '10px' }}>
            {currentStation.genre}
          </div>
        )}
        {error && (
          <div className="stat-label" style={{ color: '#ff4444', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        {loading && (
          <div className="stat-label" style={{ marginBottom: '10px' }}>
            LOADING...
          </div>
        )}
        <button 
          className="pipboy-button" 
          onClick={handlePlayPause} 
          style={{ fontSize: '18px', padding: '15px 30px' }}
          disabled={loading}
        >
          {loading ? 'LOADING...' : isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ marginBottom: '10px' }}>STATIONS</div>
        <ul className="pipboy-list">
          {stations.map((station) => (
            <li
              key={station.id}
              className={`pipboy-list-item ${currentStation?.id === station.id ? 'active' : ''}`}
              onClick={() => handleStationSelect(station)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="stat-value">{station.name}</div>
                {station.genre && (
                  <div className="stat-label" style={{ fontSize: '10px', marginTop: '3px' }}>
                    {station.genre}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ marginBottom: '10px' }}>
          VOLUME: {Math.round(volume * 100)}%
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="pipboy-input"
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(0, 255, 65, 0.2)',
            outline: 'none',
            border: '1px solid var(--pipboy-border)',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Audio Visualizer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'flex-end',
        height: '100px',
        marginTop: '20px',
        padding: '10px',
        border: '2px solid var(--pipboy-border)',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="visualizer-bar"
            style={{
              width: '8px',
              backgroundColor: isPlaying ? 'var(--pipboy-green)' : 'rgba(0, 255, 65, 0.3)',
              animationDelay: `${i * 0.1}s`,
              boxShadow: isPlaying ? '0 0 10px var(--pipboy-green)' : 'none',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          />
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentStation?.url}
        crossOrigin="anonymous"
        preload="none"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default RadioTab;

