---
description: UpToTrial data model for clinical trials
globs: ["**/trial*.ts", "**/trial*.tsx"]
alwaysApply: false
---

# Clinical Trial Data Model

When working with clinical trial data in UpToTrial, follow this data model structure:

## Trial Type

The `Trial` type represents a clinical trial and should include these fields:

```typescript
interface Trial {
  // Core identifiers
  id: string;                // NCT ID from ClinicalTrials.gov
  title: string;             // Official title of the trial
  briefSummary: string;      // Short description of the trial
  
  // Classification
  condition: string;         // Primary condition being studied
  status: string;            // Recruitment status (e.g., "Recruiting", "Completed")
  phase: string;             // Trial phase (e.g., "Phase 1", "Phase 2/3")
  
  // Location information
  locations: Array<string>;  // List of study locations
  
  // Eligibility criteria
  eligibility: {
    gender: string;          // "All", "Male", or "Female"
    minAge: string;          // Minimum age with unit (e.g., "18 Years")
    maxAge: string;          // Maximum age with unit (e.g., "75 Years")
    criteria: string;        // Detailed inclusion/exclusion criteria
  };
}
```

## Status Values

Use these standard status values:
- "Recruiting" - Currently recruiting participants
- "Active, not recruiting" - Study ongoing but not recruiting
- "Completed" - Study has concluded
- "Not yet recruiting" - Approved but not yet started
- "Unknown" - Status unknown or not specified

## Phase Values

Use these standard phase designations:
- "Phase 1"
- "Phase 2"
- "Phase 3"
- "Phase 4"
- "Phase 1/2" (for combined phases)
- "Phase 2/3" (for combined phases)
- "Not Applicable" (for non-interventional studies)

## Display Guidelines

When displaying trial data:
- Present status as tags with appropriate colors
- Use clear age formatting (e.g., "18-65 Years")
- Truncate long text with "..." and provide expansion option
- Always link to the official trial page on ClinicalTrials.gov