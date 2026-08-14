import { describe, expect, it } from 'vitest';
import {
  applyInteraction,
  createInitialProvenanceState,
  currentDwellMs,
  openedElementIds,
} from './provenance';

describe('interaction provenance', () => {
  it('records clicks without changing dwell', () => {
    const state = createInitialProvenanceState();
    applyInteraction(state, {
      timestamp: 1000,
      type: 'click',
      elementId: 'tag-click:t1:video',
      label: 'Click tag: Video',
    });
    expect(state.events).toHaveLength(1);
    expect(currentDwellMs(state, 1500)).toEqual({});
  });

  it('accumulates dwell while a section stays open and after it closes', () => {
    const state = createInitialProvenanceState();
    applyInteraction(state, {
      timestamp: 1000,
      type: 'open',
      elementId: 't1:abstract',
      label: 'Open abstract',
    });
    expect(currentDwellMs(state, 1300)['t1:abstract']).toBe(300);

    applyInteraction(state, {
      timestamp: 1800,
      type: 'close',
      elementId: 't1:abstract',
      label: 'Close abstract',
    });
    expect(state.dwellMs['t1:abstract']).toBe(800);
    expect(currentDwellMs(state, 2000)['t1:abstract']).toBe(800);
  });

  it('adds dwell across reopen cycles', () => {
    const state = createInitialProvenanceState();
    applyInteraction(state, {
      timestamp: 0, type: 'open', elementId: 'paper', label: 'open',
    });
    applyInteraction(state, {
      timestamp: 100, type: 'close', elementId: 'paper', label: 'close',
    });
    applyInteraction(state, {
      timestamp: 200, type: 'open', elementId: 'paper', label: 'open',
    });
    applyInteraction(state, {
      timestamp: 350, type: 'close', elementId: 'paper', label: 'close',
    });
    expect(state.dwellMs.paper).toBe(250);
    expect(openedElementIds(state)).toEqual(['paper']);
  });
});
