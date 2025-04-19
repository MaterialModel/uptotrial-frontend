import type { Trial } from './trial-card';

export const getMockTrials = (query: string): Array<Trial> => {
  // Ensure the query is non-empty before filtering
  if (!query.trim()) {
    return [];
  }

  // Filter mock trials based on the search query
  return mockTrials.filter(
    (trial) =>
      trial.title.toLowerCase().includes(query.toLowerCase()) ||
      trial.condition.toLowerCase().includes(query.toLowerCase()) ||
      trial.briefSummary.toLowerCase().includes(query.toLowerCase()),
  );
};

export const mockTrials: Array<Trial> = [
  {
    id: 'NCT04914728',
    title:
      'A Study of Tirzepatide (LY3298176) in Participants With Type 2 Diabetes Not Controlled With Diet and Exercise Alone',
    briefSummary:
      'This study evaluates the efficacy and safety of tirzepatide in participants with type 2 diabetes who have not received diabetes medications before. Participants will either receive tirzepatide or placebo once a week for 40 weeks.',
    condition: 'Type 2 Diabetes',
    status: 'Recruiting',
    phase: 'Phase 3',
    locations: [
      'University Medical Center, New York, NY',
      'Mayo Clinic, Rochester, MN',
      'Cleveland Clinic, Cleveland, OH',
    ],
    eligibility: {
      gender: 'All',
      minAge: '18 Years',
      maxAge: '75 Years',
      criteria:
        'Inclusion: HbA1c between 7.0-9.5%, BMI ≥ 25 kg/m². Exclusion: Type 1 diabetes, diabetic ketoacidosis, prior use of any diabetes medication.',
    },
  },
  {
    id: 'NCT04264533',
    title:
      'Efficacy and Safety of Novel Dual GIP/GLP-1 Receptor Agonist in Type 2 Diabetes',
    briefSummary:
      'This study evaluates the efficacy and safety of a novel dual GIP/GLP-1 receptor agonist in patients with type 2 diabetes. The study will compare the drug against placebo and an existing GLP-1 receptor agonist.',
    condition: 'Type 2 Diabetes',
    status: 'Completed',
    phase: 'Phase 2',
    locations: [
      'Stanford Medical Center, Palo Alto, CA',
      'Johns Hopkins Hospital, Baltimore, MD',
    ],
    eligibility: {
      gender: 'All',
      minAge: '21 Years',
      maxAge: '70 Years',
      criteria:
        'Inclusion: HbA1c between 7.5-10.0%, BMI ≥ 25 kg/m². Exclusion: History of pancreatitis, medullary thyroid carcinoma.',
    },
  },
  {
    id: 'NCT05086926',
    title:
      'Study of Pembrolizumab Plus Lenvatinib Versus Standard of Care in Recurrent/Metastatic Head and Neck Squamous Cell Carcinoma',
    briefSummary:
      'This study compares pembrolizumab plus lenvatinib versus standard of care in participants with recurrent/metastatic head and neck squamous cell carcinoma that has progressed after platinum therapy.',
    condition: 'Head and Neck Cancer',
    status: 'Recruiting',
    phase: 'Phase 3',
    locations: [
      'MD Anderson Cancer Center, Houston, TX',
      'Memorial Sloan Kettering, New York, NY',
      'Dana-Farber Cancer Institute, Boston, MA',
    ],
    eligibility: {
      gender: 'All',
      minAge: '18 Years',
      maxAge: 'No limit',
      criteria:
        'Inclusion: Histologically confirmed recurrent/metastatic HNSCC, progression after platinum-based therapy. Exclusion: Active autoimmune disease, prior anti-PD-1/PD-L1 therapy.',
    },
  },
  {
    id: 'NCT04896385',
    title:
      'A Study to Find Out How Well Finerenone Works and How Safe it is in Children and Adolescents with Chronic Kidney Disease and High Levels of Protein in the Urine',
    briefSummary:
      'This study evaluates the efficacy and safety of finerenone compared to placebo in pediatric participants with chronic kidney disease and severely increased proteinuria.',
    condition: 'Chronic Kidney Disease',
    status: 'Recruiting',
    phase: 'Phase 3',
    locations: [
      "Boston Children's Hospital, Boston, MA",
      "Children's Hospital of Philadelphia, Philadelphia, PA",
    ],
    eligibility: {
      gender: 'All',
      minAge: '6 Years',
      maxAge: '18 Years',
      criteria:
        'Inclusion: eGFR ≥ 30 mL/min/1.73m², UACR ≥ 300 mg/g. Exclusion: Kidney transplant, diabetic kidney disease.',
    },
  },
  {
    id: 'NCT05093959',
    title:
      "A Study to Evaluate the Efficacy and Safety of Donanemab Compared to Placebo in Participants With Early Symptomatic Alzheimer's Disease",
    briefSummary:
      "This study evaluates whether donanemab slows disease progression in participants with early symptomatic Alzheimer's disease with intermediate tau pathology.",
    condition: "Alzheimer's Disease",
    status: 'Recruiting',
    phase: 'Phase 3',
    locations: [
      'UCSF Memory and Aging Center, San Francisco, CA',
      "Yale Alzheimer's Disease Research Unit, New Haven, CT",
      'Northwestern University, Chicago, IL',
    ],
    eligibility: {
      gender: 'All',
      minAge: '60 Years',
      maxAge: '85 Years',
      criteria:
        'Inclusion: Gradual and progressive memory impairment for ≥ 6 months, positive amyloid PET scan. Exclusion: Significant neurological disease other than AD.',
    },
  },
];
