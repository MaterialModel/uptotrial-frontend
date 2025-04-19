---
description: UpToTrial code standards and conventions
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
---

# UpToTrial Code Standards

When working with the UpToTrial codebase, follow these conventions:

## TypeScript Standards

- Use TypeScript for all new code
- Prefer `type` over `interface` for most use cases
- Use `Array<T>` syntax rather than shorthand `T[]` syntax
- Always use explicit type annotations for function returns
- Use `type` imports when importing types: `import type { Type } from './file'`

## Component Structure

- One component per file
- Use function components with arrow syntax
- Extract complex logic to custom hooks
- Place component-specific types at the top of the file

## Styling Conventions

- Use TailwindCSS utility classes for styling
- Group Tailwind classes logically:
  1. Layout & positioning
  2. Dimensions
  3. Typography
  4. Colors & appearance
  5. Interactions/states
- Use meaningful class names for components

## Example Component

```tsx
import { useState } from 'react';
import type { Trial } from '../types';

interface TrialCardProps {
  trial: Trial;
  onSelect?: (id: string) => void;
}

export const TrialCard = ({ trial, onSelect }: TrialCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleClick = (): void => {
    if (onSelect) {
      onSelect(trial.id);
    }
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className="flex flex-col p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      {/* Component content here */}
    </div>
  );
};
```