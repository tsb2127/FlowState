# Flowstate

Flowstate is a gamified productivity web app inspired by Mihaly Csikszentmihalyi's Flow theory. It helps users log real-world tasks and classify each session into Flow, Anxiety, or Boredom based on challenge vs. skill.

## How Flow is calculated

For each session:

- If `abs(skill - challenge) <= 1` → **FLOW**
- Else if `challenge > skill` → **ANXIETY**
- Else → **BOREDOM**

## Gameplay loop

1. Enter a task name.
2. Set challenge (1–10) and reflected skill (1–10).
3. Flowstate evaluates the mental state.
4. XP is awarded:
   - FLOW: +50 XP
   - ANXIETY: +30 XP
   - BOREDOM: +10 XP
5. Session is added to history and plotted on the Flow Map.

## Features

- Interactive HTML Canvas Flow Map (Challenge X-axis, Skill Y-axis) with zones and diagonal Flow band
- Interactive Flow Map (Challenge X-axis, Skill Y-axis)
- Session colors:
  - Green = Flow
  - Red = Anxiety
  - Blue = Boredom
- Status panel for current state + total XP
- Session history list
- localStorage persistence (sessions + XP across reloads)

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
