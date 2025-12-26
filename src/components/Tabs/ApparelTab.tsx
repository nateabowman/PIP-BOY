import React, { useState } from 'react';
import { usePipBoy, ApparelItem } from '../../context/PipBoyContext';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';

const ApparelTab: React.FC = () => {
  const { apparel, addApparelItem, removeApparelItem, setApparel } = usePipBoy();
  const { playClick } = usePipBoySounds();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Body' as ApparelItem['category']
  });

  const categories: ApparelItem['category'][] = ['Head', 'Body', 'Legs', 'Feet', 'Accessory'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    const newItem: ApparelItem = {
      id: Date.now().toString(),
      ...formData,
      equipped: false
    };
    
    addApparelItem(newItem);
    setFormData({ name: '', category: 'Body' });
    setShowAddForm(false);
  };

  const handleEquip = (id: string) => {
    playClick();
    const item = apparel.find(a => a.id === id);
    if (item) {
      // Unequip other items in same category, toggle current item
      const updatedApparel = apparel.map(a => 
        a.category === item.category && a.id !== id 
          ? { ...a, equipped: false }
          : a.id === id
          ? { ...a, equipped: !a.equipped }
          : a
      );
      setApparel(updatedApparel);
    }
  };

  const handleDelete = (id: string) => {
    playClick();
    removeApparelItem(id);
  };

  const getApparelByCategory = (category: ApparelItem['category']) => {
    return apparel.filter(item => item.category === category);
  };

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
          {showAddForm ? 'CANCEL' : 'ADD APPAREL'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '2px solid var(--pipboy-border)' }}>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Name</label>
            <input
              type="text"
              className="pipboy-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Category</label>
            <select
              className="pipboy-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ApparelItem['category'] })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="pipboy-button">ADD</button>
        </form>
      )}

      {categories.map((category) => {
        const items = getApparelByCategory(category);
        if (items.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: '20px' }}>
            <div className="stat-label" style={{ fontSize: '16px', marginBottom: '10px' }}>{category}</div>
            <ul className="pipboy-list">
              {items.map((item) => (
                <li key={item.id} className="pipboy-list-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div className={`stat-value ${item.equipped ? 'glow-pulse' : ''}`}>
                        {item.equipped ? '[EQUIPPED] ' : ''}{item.name}
                      </div>
                    </div>
                    <div>
                      <button
                        className="pipboy-button"
                        onClick={() => handleEquip(item.id)}
                        style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                      >
                        {item.equipped ? 'UNEQUIP' : 'EQUIP'}
                      </button>
                      <button
                        className="pipboy-button"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {apparel.length === 0 && (
        <div className="stat-label">No apparel items</div>
      )}
    </div>
  );
};

export default ApparelTab;

