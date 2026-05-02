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
