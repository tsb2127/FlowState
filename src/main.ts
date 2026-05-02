import { Dashboard } from './ui/Dashboard';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

new Dashboard(app);

const style = document.createElement('style');
style.textContent = `
  :root { font-family: Inter, system-ui, sans-serif; color: #111827; background: #f3f4f6; }
  body { margin: 0; }
  .container { max-width: 900px; margin: 0 auto; padding: 1rem; display: grid; gap: 1rem; }
  .card { background: white; border-radius: 12px; padding: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .form { display: grid; gap: .75rem; }
  label { display: grid; gap: .25rem; }
  button { border: 0; background: #111827; color: white; padding: .6rem .8rem; border-radius: 8px; cursor: pointer; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
  #flow-map { width: 100%; max-height: 360px; }
`;
document.head.append(style);
