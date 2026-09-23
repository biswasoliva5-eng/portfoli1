/**
 * IndexedDB storage layer for portfolio content.
 * Provides limitless client-side storage (hundreds of megabytes)
 * so that uploaded artworks, high-res photos, and settings never crash with QuotaExceededError.
 */
import { PortfolioData } from '../types.js';

const DB_NAME = 'OlivaBiswasCMS';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio';
const KEY_DATA = 'portfolio_content';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

export async function getIdbPortfolioData(): Promise<PortfolioData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_DATA);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function setIdbPortfolioData(data: PortfolioData): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, KEY_DATA);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
