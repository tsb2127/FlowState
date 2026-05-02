import type { Session } from './flowEngine';

export interface PlayerProgress {
  totalXp: number;
}

export function calculateTotalXp(sessions: Session[]): number {
  return sessions.reduce((total, session) => total + session.xpEarned, 0);
}
