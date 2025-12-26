import React, { useState } from 'react';
import { usePipBoy, Note } from '../../context/PipBoyContext';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';
import { formatDate } from '../../utils/formatters';
import YouTubeSection from './YouTubeSection';

const DataTab: React.FC = () => {
  const { notes, addNote, updateNote, removeNote } = usePipBoy();
  const { playClick } = usePipBoySounds();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Note' as 'Note' | 'Holotape'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    if (editingId) {
      updateNote(editingId, formData);
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addNote(newNote);
    }
    
    setFormData({ title: '', content: '', category: 'Note' });
    setShowAddForm(false);
  };

  const handleEdit = (note: Note) => {
    playClick();
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setEditingId(note.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    playClick();
    removeNote(id);
  };

  const notesList = notes.filter(n => n.category === 'Note');
  const holotapesList = notes.filter(n => n.category === 'Holotape');

  if (showYouTube) {
    return (
      <div className="tab-content fade-in">
        <div style={{ marginBottom: '15px' }}>
          <button 
            className="pipboy-button" 
            onClick={() => {
              playClick();
              setShowYouTube(false);
            }}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            ← BACK TO DATA
          </button>
        </div>
        <YouTubeSection onClose={() => setShowYouTube(false)} />
      </div>
    );
  }

  return (
    <div className="tab-content fade-in">
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          className="pipboy-button" 
          onClick={() => {
            playClick();
            setShowAddForm(!showAddForm);
            setEditingId(null);
            setFormData({ title: '', content: '', category: 'Note' });
          }}
        >
          {showAddForm ? 'CANCEL' : 'NEW ENTRY'}
        </button>
        <button 
          className="pipboy-button" 
          onClick={() => {
            playClick();
            setShowYouTube(true);
          }}
        >
          WATCH VIDEOS
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '2px solid var(--pipboy-border)' }}>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Category</label>
            <select
              className="pipboy-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Note' | 'Holotape' })}
            >
              <option value="Note">Note</option>
              <option value="Holotape">Holotape</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Title</label>
            <input
              type="text"
              className="pipboy-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Content</label>
            <textarea
              className="pipboy-input"
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="pipboy-button">
            {editingId ? 'UPDATE' : 'SAVE'}
          </button>
        </form>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>NOTES</div>
        <ul className="pipboy-list">
          {notesList.length === 0 ? (
            <li className="pipboy-list-item">No notes</li>
          ) : (
            notesList.map((note) => (
              <li key={note.id} className="pipboy-list-item">
                <div className="stat-value">{note.title}</div>
                <div className="stat-label" style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </div>
                <div className="stat-label" style={{ marginTop: '5px', fontSize: '10px' }}>
                  {formatDate(note.createdAt)}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    className="pipboy-button"
                    onClick={() => handleEdit(note)}
                    style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                  >
                    EDIT
                  </button>
                  <button
                    className="pipboy-button"
                    onClick={() => handleDelete(note.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    DELETE
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>HOLOTAPES</div>
        <ul className="pipboy-list">
          {holotapesList.length === 0 ? (
            <li className="pipboy-list-item">No holotapes</li>
          ) : (
            holotapesList.map((holotape) => (
              <li key={holotape.id} className="pipboy-list-item">
                <div className="stat-value">{holotape.title}</div>
                <div className="stat-label" style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                  {holotape.content}
                </div>
                <div className="stat-label" style={{ marginTop: '5px', fontSize: '10px' }}>
                  {formatDate(holotape.createdAt)}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    className="pipboy-button"
                    onClick={() => handleEdit(holotape)}
                    style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                  >
                    EDIT
                  </button>
                  <button
                    className="pipboy-button"
                    onClick={() => handleDelete(holotape.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    DELETE
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>FALLOUT YOUTUBERS</div>
        <ul className="pipboy-list">
          {[
            { name: 'Oxhorn', url: 'https://www.youtube.com/@Oxhorn', description: 'Lore & Story Analysis' },
            { name: 'Many A True Nerd', url: 'https://www.youtube.com/@ManyATrueNerd', description: 'Gameplay & Challenges' },
            { name: 'MxR Mods', url: 'https://www.youtube.com/@MxRMods', description: 'Mods & Gameplay' },
            { name: 'TheEpicNate315', url: 'https://www.youtube.com/@TheEpicNate315', description: 'Tips, Tricks & Secrets' },
            { name: 'Jabo', url: 'https://www.youtube.com/@Jabo0', description: 'Speedruns & Challenges' },
            { name: 'Fudgemuppet', url: 'https://www.youtube.com/@Fudgemuppet', description: 'Lore & Character Builds' },
            { name: 'Alchestbreach', url: 'https://www.youtube.com/@AlChestbreach', description: 'Mod Reviews & Gameplay' },
            { name: 'Gopher', url: 'https://www.youtube.com/@GophersVids', description: 'Mods & Tutorials' },
            { name: 'JuiceHead', url: 'https://www.youtube.com/@JuiceHead', description: 'News & Updates' },
            { name: 'Triangle City', url: 'https://www.youtube.com/@TriangleCity', description: 'Lore & Analysis' }
          ].map((youtuber, index) => (
            <li 
              key={index} 
              className="pipboy-list-item"
              onClick={() => {
                playClick();
                window.open(youtuber.url, '_blank', 'noopener,noreferrer');
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-value" style={{ textDecoration: 'underline', textShadow: '0 0 5px var(--pipboy-green)' }}>
                {youtuber.name}
              </div>
              <div className="stat-label" style={{ marginTop: '5px', fontSize: '11px' }}>
                {youtuber.description}
              </div>
              <div className="stat-label" style={{ marginTop: '3px', fontSize: '10px', opacity: 0.7 }}>
                CLICK TO OPEN
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataTab;

