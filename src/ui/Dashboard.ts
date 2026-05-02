import { buildSession, type Session, type SessionInput } from '../core/flowEngine';
import { calculateTotalXp } from '../core/player';
import { loadSessions, saveSessions } from '../core/storage';
import { FlowMap } from './FlowMap';

export class Dashboard {
  private sessions: Session[];
  private flowMap: FlowMap;

  constructor(private root: HTMLElement) {
    this.sessions = loadSessions();
    this.root.innerHTML = this.template();

    const canvas = this.q<HTMLCanvasElement>('#flow-map');
    this.flowMap = new FlowMap(canvas);
    this.bindEvents();
    this.refresh();
  }

  private template(): string {
    return `
      <main class="container">
        <h1>Flowstate</h1>
        <section class="card">
          <h2>Log a Session</h2>
          <form id="session-form" class="form">
            <label>Task Name <input required id="task" maxlength="80" /></label>
            <label>Challenge: <span id="challenge-value">5</span>
              <input id="challenge" type="range" min="1" max="10" value="5" />
            </label>
            <label>Skill: <span id="skill-value">5</span>
              <input id="skill" type="range" min="1" max="10" value="5" />
            </label>
            <button type="submit">Add Session</button>
          </form>
        </section>

        <section class="card">
          <h2>Flow Map</h2>
          <canvas id="flow-map"></canvas>
        </section>

        <section class="card status">
          <h2>Status</h2>
          <p>Current State: <strong id="current-state">-</strong></p>
          <p>Total XP: <strong id="total-xp">0</strong></p>
        </section>

        <section class="card">
          <h2>History</h2>
          <ul id="history"></ul>
        </section>
      </main>
    `;
  }

  private bindEvents(): void {
    const challenge = this.q<HTMLInputElement>('#challenge');
    const skill = this.q<HTMLInputElement>('#skill');
    const challengeValue = this.q<HTMLElement>('#challenge-value');
    const skillValue = this.q<HTMLElement>('#skill-value');

    challenge.addEventListener('input', () => {
      challengeValue.textContent = challenge.value;
    });

    skill.addEventListener('input', () => {
      skillValue.textContent = skill.value;
    });

    this.q<HTMLFormElement>('#session-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const task = this.q<HTMLInputElement>('#task').value.trim();
      if (!task) return;

      const input: SessionInput = {
        task,
        challenge: Number(challenge.value),
        skill: Number(skill.value)
      };

      const session = buildSession(input);
      this.sessions = [session, ...this.sessions];
      saveSessions(this.sessions);
      this.q<HTMLInputElement>('#task').value = '';
      this.refresh(session.state, session.id);
    });
  }

  private refresh(currentState?: Session['state'], newlyAddedId?: string): void {
    this.flowMap.render(this.sessions, newlyAddedId);
      this.refresh(session.state);
    });
  }

  private refresh(currentState?: Session['state']): void {
    this.flowMap.render(this.sessions);
    this.q('#current-state').textContent = currentState ?? this.sessions[0]?.state ?? '-';
    this.q('#total-xp').textContent = String(calculateTotalXp(this.sessions));

    const history = this.q<HTMLUListElement>('#history');
    history.innerHTML = this.sessions
      .map((session) => `<li><strong>${session.task}</strong> — C${session.challenge} / S${session.skill} — ${session.state} (+${session.xpEarned} XP)</li>`)
      .join('');
  }

  private q<T extends HTMLElement>(selector: string): T {
    const el = this.root.querySelector<T>(selector);
    if (!el) throw new Error(`Missing element: ${selector}`);
    return el;
  }
}
