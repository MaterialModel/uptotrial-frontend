export interface Trial {
  id: string;
  title: string;
  briefSummary: string;
  condition: string;
  status: string;
  phase: string;
  locations: Array<string>;
  eligibility: {
    gender: string;
    minAge: string;
    maxAge: string;
    criteria: string;
  };
}

export const TrialCard = ({ trial }: { trial: Trial }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {trial.phase}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${trial.status === 'Recruiting' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
          >
            {trial.status}
          </span>
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {trial.condition}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {trial.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 dark:text-gray-300">
          {trial.briefSummary}
        </p>

        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Eligibility
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {trial.eligibility.gender}, {trial.eligibility.minAge} -{' '}
            {trial.eligibility.maxAge}
          </p>
        </div>

        {trial.locations.length > 0 && (
          <div className="mt-1">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Locations
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {trial.locations.slice(0, 2).join(', ')}
              {trial.locations.length > 2 &&
                ` +${trial.locations.length - 2} more`}
            </p>
          </div>
        )}

        <div className="mt-4">
          <a
            href={`https://clinicaltrials.gov/study/${trial.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            View on ClinicalTrials.gov
            <svg
              className="ms-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>External link arrow</title>
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
