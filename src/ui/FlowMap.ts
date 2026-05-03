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

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not supported');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  render(sessions: Session[]): void {
    this.draw(sessions);
  }

  private resize(): void {
    const width = this.canvas.clientWidth || 800;
    this.canvas.width = width;
    this.canvas.height = 360;
  }

  private draw(sessions: Session[]): void {
    this.resize();
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

    for (const session of sessions) {
      ctx.beginPath();
      ctx.fillStyle = pointColor(session.state);
      ctx.arc(xToPx(session.challenge), yToPx(session.skill), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}
