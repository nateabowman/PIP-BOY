import React, { useState } from 'react';
import { usePipBoy, InventoryItem } from '../../context/PipBoyContext';
import { usePipBoySounds } from '../../hooks/usePipBoySounds';
import { formatWeight, formatValue } from '../../utils/formatters';

const InventoryTab: React.FC = () => {
  const { inventory, addInventoryItem, removeInventoryItem } = usePipBoy();
  const { playClick } = usePipBoySounds();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Misc',
    weight: 0,
    value: 0,
    condition: 100,
    description: ''
  });

  const categories = ['Weapon', 'Aid', 'Food', 'Junk', 'Misc'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...formData
    };
    
    addInventoryItem(newItem);
    setFormData({
      name: '',
      category: 'Misc',
      weight: 0,
      value: 0,
      condition: 100,
      description: ''
    });
    setShowAddForm(false);
  };

  const handleRemove = (id: string) => {
    playClick();
    removeInventoryItem(id);
  };

  const totalWeight = inventory.reduce((sum, item) => sum + item.weight, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);

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
          {showAddForm ? 'CANCEL' : 'ADD ITEM'}
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Weight</label>
            <input
              type="number"
              step="0.1"
              className="pipboy-input"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Value</label>
            <input
              type="number"
              className="pipboy-input"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label className="stat-label">Condition</label>
            <input
              type="number"
              min="0"
              max="100"
              className="pipboy-input"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: parseInt(e.target.value) || 100 })}
            />
          </div>
          <button type="submit" className="pipboy-button">ADD</button>
        </form>
      )}

      <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid var(--pipboy-border)' }}>
        <div className="stat-label">Total Weight: {formatWeight(totalWeight)}</div>
        <div className="stat-label">Total Value: {formatValue(totalValue)}</div>
      </div>

      <ul className="pipboy-list">
        {inventory.length === 0 ? (
          <li className="pipboy-list-item">No items in inventory</li>
        ) : (
          inventory.map((item) => (
            <li key={item.id} className="pipboy-list-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div className="stat-value">{item.name}</div>
                  <div className="stat-label">{item.category}</div>
                  <div className="stat-label">
                    {formatWeight(item.weight)} | {formatValue(item.value)} | Condition: {item.condition}%
                  </div>
                  {item.description && (
                    <div className="stat-label" style={{ marginTop: '5px' }}>{item.description}</div>
                  )}
                </div>
                <button
                  className="pipboy-button"
                  onClick={() => handleRemove(item.id)}
                  style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
                >
                  REMOVE
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default InventoryTab;

