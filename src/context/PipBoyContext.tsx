import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TabType = 'STAT' | 'INVENTORY' | 'DATA' | 'MAP' | 'RADIO' | 'QUESTS' | 'APPAREL';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  value: number;
  condition: number;
  description?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Note' | 'Holotape';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApparelItem {
  id: string;
  name: string;
  category: 'Head' | 'Body' | 'Legs' | 'Feet' | 'Accessory';
  equipped: boolean;
  image?: string;
}

export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timestamp: Date;
  notes?: string;
}

export interface Settings {
  soundEnabled: boolean;
  volume: number;
  theme: string;
}

interface PipBoyContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (id: string) => void;
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  removeQuest: (id: string) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  apparel: ApparelItem[];
  setApparel: (apparel: ApparelItem[]) => void;
  addApparelItem: (item: ApparelItem) => void;
  removeApparelItem: (id: string) => void;
  locations: LocationData[];
  setLocations: (locations: LocationData[]) => void;
  addLocation: (location: LocationData) => void;
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  bootComplete: boolean;
  setBootComplete: (complete: boolean) => void;
}

const PipBoyContext = createContext<PipBoyContextType | undefined>(undefined);

export const usePipBoy = () => {
  const context = useContext(PipBoyContext);
  if (!context) {
    throw new Error('usePipBoy must be used within PipBoyProvider');
  }
  return context;
};

interface PipBoyProviderProps {
  children: ReactNode;
}

export const PipBoyProvider: React.FC<PipBoyProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('STAT');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [apparel, setApparel] = useState<ApparelItem[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    volume: 0.5,
    theme: 'default'
  });

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedInventory = localStorage.getItem('pipboy-inventory');
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory));
        }

        const savedQuests = localStorage.getItem('pipboy-quests');
        if (savedQuests) {
          setQuests(JSON.parse(savedQuests));
        }

        const savedNotes = localStorage.getItem('pipboy-notes');
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes);
          setNotes(parsed.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt)
          })));
        }

        const savedApparel = localStorage.getItem('pipboy-apparel');
        if (savedApparel) {
          setApparel(JSON.parse(savedApparel));
        }

        const savedLocations = localStorage.getItem('pipboy-locations');
        if (savedLocations) {
          const parsed = JSON.parse(savedLocations);
          setLocations(parsed.map((l: any) => ({
            ...l,
            timestamp: new Date(l.timestamp)
          })));
        }

        const savedSettings = localStorage.getItem('pipboy-settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    localStorage.setItem('pipboy-inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pipboy-quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('pipboy-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('pipboy-apparel', JSON.stringify(apparel));
  }, [apparel]);

  useEffect(() => {
    localStorage.setItem('pipboy-locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('pipboy-settings', JSON.stringify(settings));
  }, [settings]);

  const addInventoryItem = (item: InventoryItem) => {
    setInventory([...inventory, item]);
  };

  const removeInventoryItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const addQuest = (quest: Quest) => {
    setQuests([...quests, quest]);
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(quests.map(quest => 
      quest.id === id ? { ...quest, ...updates } : quest
    ));
  };

  const removeQuest = (id: string) => {
    setQuests(quests.filter(quest => quest.id !== id));
  };

  const addNote = (note: Note) => {
    setNotes([...notes, note]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addApparelItem = (item: ApparelItem) => {
    setApparel([...apparel, item]);
  };

  const removeApparelItem = (id: string) => {
    setApparel(apparel.filter(item => item.id !== id));
  };

  const addLocation = (location: LocationData) => {
    setLocations([...locations, location]);
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings({ ...settings, ...updates });
  };

  return (
    <PipBoyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        inventory,
        setInventory,
        addInventoryItem,
        removeInventoryItem,
        quests,
        setQuests,
        addQuest,
        updateQuest,
        removeQuest,
        notes,
        setNotes,
        addNote,
        updateNote,
        removeNote,
        apparel,
        setApparel,
        addApparelItem,
        removeApparelItem,
        locations,
        setLocations,
        addLocation,
        settings,
        updateSettings,
        bootComplete,
        setBootComplete
      }}
    >
      {children}
    </PipBoyContext.Provider>
  );
};

