import type { Session } from './flowEngine';

const STORAGE_KEY = 'flowstate:data:v1';

interface PersistedData {
  sessions: Session[];
}

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedData;
    return Array.isArray(parsed.sessions) ? parsed.sessions : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  const data: PersistedData = { sessions };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
