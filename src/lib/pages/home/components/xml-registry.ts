/* xml-registry.ts
 * Single source-of-truth describing your XML vocabulary
 * ----------------------------------------------------- */

import React from 'react';
import {
  BasicCard,
  StudyCard,
  Text,
  Thought,
  Tool,
} from './chat-ui-components'; // concrete React components
import type {
  ComponentRegistry,
  PrimitiveAttr,
} from './xml-renderer/element-spec'; // path to the generic types

/* Helper to keep attr definitions concise ----------------------------- */
const str = (): { type: PrimitiveAttr } => ({ type: 'string' });
const int = (): { type: PrimitiveAttr } => ({ type: 'integer' });
const date = (): { type: PrimitiveAttr } => ({ type: 'date' });
const uri = (): { type: PrimitiveAttr } => ({ type: 'uri' });

export const xmlRegistry: ComponentRegistry = {
  /* ──────────────── Root <response> ──────────────── */
  response: {
    component: ({ children }) =>
      React.createElement('div', { className: 'response' }, children),
    children: {
      tool: { min: 0, max: 'unbounded' },
      thought: { min: 0, max: 1 },
      answer: { min: 1, max: 1 },
    },
  },

  /* ──────────────── <answer> block ──────────────── */
  answer: {
    component: ({ children }) =>
      React.createElement('div', { className: 'answer' }, children),
    mixed: true,
    children: {
      study: { max: 'unbounded' },
      tool: { max: 'unbounded' },
      text: { max: 'unbounded' },
      thought: { max: 'unbounded' },
      card: { max: 'unbounded' },
    },
  },

  /* ──────────────── Generic wrappers ─────────────── */
  tool: { component: Tool, mixed: true },
  text: { component: Text, mixed: true },
  thought: { component: Thought, mixed: true },
  card: { component: BasicCard, mixed: true },

  /* ──────────────── <study /> self-closing card ──── */
  study: {
    component: StudyCard,
    mixed: true, // StudyCard optionally shows children
    attrs: {
      status: str(),
      ntcid: str(),
      phase: str(),
      enrollment: int(),
      title: str(),
      url: uri(),
      official_title: str(),
      study_start: date(),
      primary_completion_date: date(),
      study_completion_date: date(),
      resulted_posted: date(),
      intervention: str(),
      sponsor: str(),
      location: str(),
    },
  },
} as const;
