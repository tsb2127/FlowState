import type { Session } from './flowEngine';

export function calculateTotalXp(sessions: Session[]): number {
  return sessions.reduce((total, session) => total + session.xpEarned, 0);
}
