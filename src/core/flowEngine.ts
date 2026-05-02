export type FlowState = 'FLOW' | 'ANXIETY' | 'BOREDOM';

export interface SessionInput {
  task: string;
  challenge: number;
  skill: number;
}

export interface Session extends SessionInput {
  id: string;
  state: FlowState;
  xpEarned: number;
  createdAt: string;
}

export function evaluateFlow(skill: number, challenge: number): FlowState {
  if (Math.abs(skill - challenge) <= 1) {
    return 'FLOW';
  }

  if (challenge > skill) {
    return 'ANXIETY';
  }

  return 'BOREDOM';
}

export function xpForState(state: FlowState): number {
  if (state === 'FLOW') return 50;
  if (state === 'ANXIETY') return 30;
  return 10;
}

export function buildSession(input: SessionInput): Session {
  const state = evaluateFlow(input.skill, input.challenge);
  return {
    ...input,
    state,
    xpEarned: xpForState(state),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}
