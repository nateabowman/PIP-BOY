import React, { useState } from 'react';
import { usePipBoy, Quest } from '../../context/PipBoyContext';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';
import { formatPercentage } from '../../utils/formatters';

const QuestsTab: React.FC = () => {
  const { quests, addQuest, updateQuest, removeQuest } = usePipBoy();
  const { playClick } = usePipBoySounds();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Main',
    progress: 0,
    maxProgress: 100
  });

  const categories = ['Main', 'Side', 'Misc', 'Daily'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    const newQuest: Quest = {
      id: Date.now().toString(),
      ...formData,
      completed: false
    };
    
    addQuest(newQuest);
    setFormData({
      title: '',
      description: '',
      category: 'Main',
      progress: 0,
      maxProgress: 100
    });
    setShowAddForm(false);
  };

  const handleComplete = (id: string) => {
    playClick();
    const quest = quests.find(q => q.id === id);
    if (quest) {
      updateQuest(id, { completed: true, progress: quest.maxProgress });
    }
  };

  const handleProgress = (id: string, progress: number) => {
    playClick();
    const quest = quests.find(q => q.id === id);
    if (quest) {
      const newProgress = Math.max(0, Math.min(progress, quest.maxProgress));
      updateQuest(id, { progress: newProgress, completed: newProgress >= quest.maxProgress });
    }
  };

  const handleDelete = (id: string) => {
    playClick();
    removeQuest(id);
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="tab-content fade-in">
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="pipboy-button" 
          onClick={() => {
            playClick();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? 'CANCEL' : 'NEW QUEST'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '2px solid var(--pipboy-border)' }}>
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
            <label className="stat-label">Description</label>
            <textarea
              className="pipboy-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Category</label>
            <select
              className="pipboy-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Max Progress</label>
            <input
              type="number"
              className="pipboy-input"
              value={formData.maxProgress}
              onChange={(e) => setFormData({ ...formData, maxProgress: parseInt(e.target.value) || 100 })}
            />
          </div>
          <button type="submit" className="pipboy-button">ADD QUEST</button>
        </form>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>ACTIVE QUESTS</div>
        <ul className="pipboy-list">
          {activeQuests.length === 0 ? (
            <li className="pipboy-list-item">No active quests</li>
          ) : (
            activeQuests.map((quest) => (
              <li key={quest.id} className="pipboy-list-item">
                <div className="stat-value">{quest.title}</div>
                <div className="stat-label" style={{ marginTop: '5px' }}>{quest.description}</div>
                <div className="stat-label" style={{ marginTop: '5px' }}>Category: {quest.category}</div>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <div className="stat-label">
                    Progress: {quest.progress} / {quest.maxProgress} ({formatPercentage(quest.progress, quest.maxProgress)})
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={quest.maxProgress}
                    value={quest.progress}
                    onChange={(e) => handleProgress(quest.id, parseInt(e.target.value))}
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <button
                    className="pipboy-button"
                    onClick={() => handleComplete(quest.id)}
                    style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                  >
                    COMPLETE
                  </button>
                  <button
                    className="pipboy-button"
                    onClick={() => handleDelete(quest.id)}
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

      {completedQuests.length > 0 && (
        <div>
          <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>COMPLETED QUESTS</div>
          <ul className="pipboy-list">
            {completedQuests.map((quest) => (
              <li key={quest.id} className="pipboy-list-item quest-complete">
                <div className="stat-value">{quest.title}</div>
                <div className="stat-label" style={{ marginTop: '5px' }}>{quest.description}</div>
                <button
                  className="pipboy-button"
                  onClick={() => handleDelete(quest.id)}
                  style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px' }}
                >
                  DELETE
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestsTab;

