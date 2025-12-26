import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PipBoyDB extends DBSchema {
  inventory: {
    key: string;
    value: any;
  };
  quests: {
    key: string;
    value: any;
  };
  notes: {
    key: string;
    value: any;
  };
  apparel: {
    key: string;
    value: any;
  };
  locations: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<PipBoyDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<PipBoyDB>> => {
  if (db) return db;

  db = await openDB<PipBoyDB>('pipboy-db', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('inventory')) {
        database.createObjectStore('inventory', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('quests')) {
        database.createObjectStore('quests', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('notes')) {
        database.createObjectStore('notes', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('apparel')) {
        database.createObjectStore('apparel', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('locations')) {
        database.createObjectStore('locations', { keyPath: 'id' });
      }
    }
  });

  return db;
};

export const saveToDB = async <T>(storeName: keyof PipBoyDB, data: T): Promise<void> => {
  const database = await initDB();
  await database.put(storeName, data as any);
};

export const getFromDB = async <T>(storeName: keyof PipBoyDB, key: string): Promise<T | undefined> => {
  const database = await initDB();
  return database.get(storeName, key) as T | undefined;
};

export const getAllFromDB = async <T>(storeName: keyof PipBoyDB): Promise<T[]> => {
  const database = await initDB();
  return database.getAll(storeName) as T[];
};

export const deleteFromDB = async (storeName: keyof PipBoyDB, key: string): Promise<void> => {
  const database = await initDB();
  await database.delete(storeName, key);
};

