---
description: UpToTrial project context and architecture
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
---

# UpToTrial Project Context

UpToTrial is an AI-powered search platform for clinical trials that enables users to find relevant clinical trials on ClinicalTrials.gov more effectively.

## Project Architecture

- `/src/lib/components` - Reusable UI components
- `/src/lib/layout` - Layout components (header, footer, etc.)
- `/src/lib/pages` - Page components organized by route
- `/src/lib/styles` - Global styles and theme configurations
- `/src/lib/utils` - Utility functions and helpers

## Core Features

1. **Clinical Trial Search**
   - Natural language search functionality
   - Filtering by condition, location, trial status
   - Mock data for development, real API in production

2. **Trial Result Display**
   - Card-based display of trial information
   - Key details like trial phase, status, eligibility
   - Link to view full details on ClinicalTrials.gov

## API Integration Plan

Currently using mock data, but will integrate with:
- ClinicalTrials.gov API for trial data
- Custom backend for AI-powered search features

## Naming Conventions

- Components: PascalCase (e.g., `TrialCard`)
- Hooks: camelCase with 'use' prefix (e.g., `useTrialSearch`)
- Helpers/Utils: camelCase (e.g., `formatTrialDate`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_SEARCH_RESULTS`)
- File names: kebab-case (e.g., `trial-card.tsx`)