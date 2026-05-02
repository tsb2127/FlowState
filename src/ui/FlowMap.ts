import type { Session } from '../core/flowEngine';

const COLORS = {
  flow: '#22c55e',
  anxiety: '#ef4444',
  boredom: '#3b82f6'
} as const;

function pointColor(state: Session['state']): string {
  if (state === 'FLOW') return COLORS.flow;
  if (state === 'ANXIETY') return COLORS.anxiety;
  return COLORS.boredom;
}

export class FlowMap {
  private ctx: CanvasRenderingContext2D;
  private sessions: Session[] = [];
  private lastAddedId: string | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not supported');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  render(sessions: Session[], newlyAddedId?: string): void {
    this.sessions = sessions;
    this.lastAddedId = newlyAddedId ?? null;

    if (this.lastAddedId) {
      this.animateNewPoint();
      return;
    }

    this.draw(1);
  }

  private resize(): void {
    const width = this.canvas.clientWidth || 800;
    const height = 360;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw(1);
  }

  private draw(newPointScale: number): void {
    const { ctx } = this;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pad = 40;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const plotW = w - pad * 2;
    const plotH = h - pad * 2;

    const xToPx = (x: number) => pad + ((x - 1) / 9) * plotW;
    const yToPx = (y: number) => h - pad - ((y - 1) / 9) * plotH;

    // Flow diagonal band (|skill-challenge|<=1)
    ctx.save();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
    ctx.beginPath();
    ctx.moveTo(xToPx(1), yToPx(2));
    ctx.lineTo(xToPx(1), yToPx(1));
    ctx.lineTo(xToPx(2), yToPx(1));
    ctx.lineTo(xToPx(10), yToPx(9));
    ctx.lineTo(xToPx(10), yToPx(10));
    ctx.lineTo(xToPx(9), yToPx(10));
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Grid + ticks 1..10
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';

    for (let i = 1; i <= 10; i += 1) {
      const x = xToPx(i);
      const y = yToPx(i);

      ctx.beginPath();
      ctx.moveTo(x, pad);
      ctx.lineTo(x, h - pad);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(w - pad, y);
      ctx.stroke();

      ctx.fillText(String(i), x - 3, h - pad + 16);
      ctx.fillText(String(i), pad - 18, y + 4);
    }

    // Axes labels
    ctx.fillStyle = '#111827';
    ctx.font = '13px sans-serif';
    ctx.fillText('Challenge', w / 2 - 30, h - 8);
    ctx.save();
    ctx.translate(12, h / 2 + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Skill', 0, 0);
    ctx.restore();

    // Zone labels
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = COLORS.flow;
    ctx.fillText('FLOW', xToPx(5), yToPx(6));
    ctx.fillStyle = COLORS.anxiety;
    ctx.fillText('ANXIETY', xToPx(7.5), yToPx(3.5));
    ctx.fillStyle = COLORS.boredom;
    ctx.fillText('BOREDOM', xToPx(2.2), yToPx(8.6));

    // Points
    for (const session of this.sessions) {
      const radius = session.id === this.lastAddedId ? 5 * newPointScale : 5;
      ctx.beginPath();
      ctx.fillStyle = pointColor(session.state);
      ctx.arc(xToPx(session.challenge), yToPx(session.skill), radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  private animateNewPoint(): void {
    const durationMs = 320;
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const ease = 0.75 + 0.5 * (1 - Math.pow(1 - progress, 2));
      this.draw(ease);
      if (progress < 1) requestAnimationFrame(frame);
      else {
        this.lastAddedId = null;
        this.draw(1);
      }
    };

    requestAnimationFrame(frame);
import { Chart, LinearScale, PointElement, ScatterController, Tooltip, Legend } from 'chart.js';
import type { Session } from '../core/flowEngine';

Chart.register(LinearScale, PointElement, ScatterController, Tooltip, Legend);

function stateColor(state: Session['state']): string {
  if (state === 'FLOW') return '#22c55e';
  if (state === 'ANXIETY') return '#ef4444';
  return '#3b82f6';
}

export class FlowMap {
  private chart: Chart<'scatter'>;

  constructor(canvas: HTMLCanvasElement) {
    this.chart = new Chart(canvas, {
      type: 'scatter',
      data: { datasets: [{ label: 'Sessions', data: [], pointRadius: 6, pointHoverRadius: 8 }] },
      options: {
        responsive: true,
        scales: {
          x: { min: 1, max: 10, title: { display: true, text: 'Challenge' }, ticks: { stepSize: 1 } },
          y: { min: 1, max: 10, title: { display: true, text: 'Skill' }, ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const session = (ctx.raw as { meta: Session }).meta;
                return `${session.task}: C${session.challenge} / S${session.skill} (${session.state})`;
              }
            }
          }
        }
      }
    });
  }

  render(sessions: Session[]): void {
    this.chart.data.datasets[0].data = sessions.map((session) => ({
      x: session.challenge,
      y: session.skill,
      meta: session,
      backgroundColor: stateColor(session.state)
    }));

    this.chart.data.datasets[0].pointBackgroundColor = sessions.map((session) => stateColor(session.state));
    this.chart.update();
  }
}
