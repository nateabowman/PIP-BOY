import React, { useState, useEffect } from 'react';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';

interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  channelId: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeSectionProps {
  onClose?: () => void;
}

const YouTubeSection: React.FC<YouTubeSectionProps> = ({ onClose }) => {
  const { playClick } = usePipBoySounds();
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Channel IDs for Oxhorn and TheEpicNate315
  const channels = [
    { name: 'Oxhorn', id: 'UCZ5dNZsqBjBAb8bR5Qb6eTA', url: 'https://www.youtube.com/@Oxhorn' },
    { name: 'TheEpicNate315', id: 'UCJ0-OtVpF0wOKEqT2Z1HEtA', url: 'https://www.youtube.com/@TheEpicNate315' }
  ];

  useEffect(() => {
    const fetchLatestVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allVideos: YouTubeVideo[] = [];
        
        // Fetch latest videos from each channel using RSS feed
        for (const channel of channels) {
          try {
            // Try RSS2JSON proxy first
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
            const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=public`;
            
            const response = await fetch(proxyUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
              // Get the 3 most recent videos
              const recentVideos = data.items.slice(0, 3).map((item: any) => {
                // Extract video ID from YouTube link
                const videoIdMatch = item.link.match(/[?&]v=([^&]+)/);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                
                return {
                  id: videoId || '',
                  title: item.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
                  channelName: channel.name,
                  channelId: channel.id,
                  thumbnail: item.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''),
                  publishedAt: item.pubDate
                };
              });
              
              allVideos.push(...recentVideos);
            } else {
              throw new Error('No videos found');
            }
          } catch (err) {
            console.error(`Error fetching ${channel.name}:`, err);
            // Add placeholder - user can click channel button
            allVideos.push({
              id: '',
              title: `${channel.name} - Visit Channel for Latest Videos`,
              channelName: channel.name,
              channelId: channel.id,
              thumbnail: '',
              publishedAt: new Date().toISOString()
            });
          }
        }
        
        if (allVideos.length === 0) {
          setError('Unable to load videos. Click channel buttons to visit YouTube.');
        }
        
        setVideos(allVideos);
      } catch (err) {
        setError('Failed to load videos. Click channel names to visit YouTube directly.');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVideos();
  }, []);

  const handleVideoSelect = (video: YouTubeVideo) => {
    playClick();
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    playClick();
    setSelectedVideo(null);
  };

  const handleChannelClick = (url: string) => {
    playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (selectedVideo) {
    return (
      <div className="fade-in">
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="stat-value">{selectedVideo.title}</div>
          <button className="pipboy-button" onClick={handleCloseVideo} style={{ padding: '8px 16px', fontSize: '12px' }}>
            BACK
          </button>
        </div>
        <div className="stat-label" style={{ marginBottom: '10px' }}>
          {selectedVideo.channelName}
        </div>
        <div style={{ 
          position: 'relative', 
          paddingBottom: '56.25%', 
          height: 0, 
          overflow: 'hidden',
          border: '3px solid var(--pipboy-border)',
          boxShadow: '0 0 20px var(--pipboy-glow)'
        }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={selectedVideo.title}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <button 
            className="pipboy-button" 
            onClick={() => {
              playClick();
              window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, '_blank', 'noopener,noreferrer');
            }}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            OPEN ON YOUTUBE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>
          LATEST FALLOUT VIDEOS
        </div>
        {loading && (
          <div className="stat-label" style={{ marginBottom: '10px' }}>LOADING VIDEOS...</div>
        )}
        {error && (
          <div className="stat-label" style={{ color: '#ff4444', marginBottom: '10px' }}>{error}</div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ fontSize: '14px', marginBottom: '10px' }}>CHANNELS</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {channels.map((channel) => (
            <button
              key={channel.id}
              className="pipboy-button"
              onClick={() => handleChannelClick(channel.url)}
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              {channel.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="stat-label" style={{ fontSize: '14px', marginBottom: '10px' }}>RECENT UPLOADS</div>
        <ul className="pipboy-list">
          {videos.length === 0 && !loading ? (
            <li className="pipboy-list-item">No videos available</li>
          ) : (
            videos.map((video, index) => (
              <li
                key={`${video.channelId}-${index}`}
                className="pipboy-list-item"
                onClick={() => {
                  if (video.id) {
                    handleVideoSelect(video);
                  } else {
                    // If no video ID, open channel
                    const channel = channels.find(c => c.id === video.channelId);
                    if (channel) {
                      handleChannelClick(channel.url);
                    }
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{
                        width: '120px',
                        height: '68px',
                        border: '2px solid var(--pipboy-border)',
                        objectFit: 'cover',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)'
                      }}
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '120px',
                      height: '68px',
                      border: '2px solid var(--pipboy-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: 'rgba(0, 255, 65, 0.1)'
                    }}>
                      <div className="stat-label" style={{ fontSize: '10px', textAlign: 'center' }}>NO THUMBNAIL</div>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div className="stat-value" style={{ fontSize: '14px', marginBottom: '5px' }}>
                      {video.title}
                    </div>
                    <div className="stat-label" style={{ fontSize: '11px', marginBottom: '3px' }}>
                      {video.channelName}
                    </div>
                    <div className="stat-label" style={{ fontSize: '10px', opacity: 0.7 }}>
                      {video.id ? 'CLICK TO WATCH' : 'CLICK TO VISIT CHANNEL'}
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default YouTubeSection;

