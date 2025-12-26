import React from 'react';
import { usePipBoy, TabType } from '../context/PipBoyContext';
import { usePipBoySounds } from '../hooks/usePipBoySounds';

const tabs: TabType[] = ['STAT', 'INVENTORY', 'DATA', 'MAP', 'RADIO', 'QUESTS', 'APPAREL'];

const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = usePipBoy();
  const { playTabSwitch } = usePipBoySounds();

  const handleTabClick = (tab: TabType) => {
    if (tab !== activeTab) {
      playTabSwitch();
      setActiveTab(tab);
    }
  };

  return (
    <div className="pipboy-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pipboy-tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

