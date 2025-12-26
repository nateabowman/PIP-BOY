import React from 'react';
import { usePipBoy } from '../context/PipBoyContext';
import Screen from './Screen';
import BootAnimation from './BootAnimation';
import TabNavigation from './TabNavigation';
import StatTab from './Tabs/StatTab';
import InventoryTab from './Tabs/InventoryTab';
import DataTab from './Tabs/DataTab';
import MapTab from './Tabs/MapTab';
import RadioTab from './Tabs/RadioTab';
import QuestsTab from './Tabs/QuestsTab';
import ApparelTab from './Tabs/ApparelTab';

const PipBoy: React.FC = () => {
  const { activeTab, bootComplete } = usePipBoy();

  if (!bootComplete) {
    return <BootAnimation />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'STAT':
        return <StatTab />;
      case 'INVENTORY':
        return <InventoryTab />;
      case 'DATA':
        return <DataTab />;
      case 'MAP':
        return <MapTab />;
      case 'RADIO':
        return <RadioTab />;
      case 'QUESTS':
        return <QuestsTab />;
      case 'APPAREL':
        return <ApparelTab />;
      default:
        return <StatTab />;
    }
  };

  return (
    <Screen>
      <div className="pipboy-container">
        <div className="pipboy-header">
          <h1>PIP-BOY 3000</h1>
        </div>
        <TabNavigation />
        <div className="pipboy-content">
          {renderTabContent() || <div>Loading...</div>}
        </div>
      </div>
    </Screen>
  );
};

export default PipBoy;

