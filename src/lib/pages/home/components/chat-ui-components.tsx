import React, { type PropsWithChildren, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Interfaces and Types ---
export interface CardProps {
  status?: string;
  ntcid?: string;
  phase?: string;
  enrollment?: number;
  title?: string;
  url?: string;
  official_title?: string;
  study_start?: string;
  primary_completion_date?: string;
  study_completion_date?: string;
  resulted_posted?: string;
  intervention?: string;
  sponsor?: string;
  location?: string;
}

// --- Utility Functions ---

/**
 * Returns Tailwind classes for the status button based on the status string.
 */
const StatusButton = (status: string): string => {
  // Convert to lowercase for case-insensitive comparison
  const statusLower = status.toLowerCase();

  // Green theme for active trials
  if (
    statusLower === 'recruiting' ||
    statusLower === 'active, not recruiting'
  ) {
    return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700';
  }
  // Blue theme for completed trials
  if (statusLower === 'completed') {
    return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700';
  }
  // Red theme for terminated/withdrawn/suspended trials
  if (
    statusLower === 'terminated' ||
    statusLower === 'withdrawn' ||
    statusLower === 'suspended'
  ) {
    return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700';
  }
  // Grey theme for other known statuses
  if (
    statusLower === 'not yet recruiting' ||
    statusLower === 'enrolling by invitation' ||
    statusLower === 'unknown'
  ) {
    return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600';
  }
  // Default to grey
  return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600';
};

/**
 * Checks if a date string represents a date in the past.
 */
const isDateInPast = (dateString?: string): boolean => {
  if (!dateString) {
    return false;
  }
  // Attempt to parse the date.
  const date = new Date(dateString);
  // Use Number.isNaN for type safety, checking the parsed date's validity.
  if (Number.isNaN(date.getTime())) {
    // console.warn(`Invalid date string provided: ${dateString}`); // Optional warning
    return false; // Treat invalid dates as not in the past
  }
  const now = new Date();
  return date < now;
};

/**
 * Generates a UUID using the uuid library.
 */
const generateUniqueId = (): string => {
  // Use crypto.randomUUID if available (modern browsers)
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Determines how many phase bars to show based on the phase string.
 */
const getPhaseBarCount = (phase?: string): number => {
  if (!phase) {
    return 0;
  }
  const phaseLower = phase.toLowerCase();
  if (phaseLower.includes('3') || phaseLower.includes('4')) {
    return 3;
  }
  if (phaseLower.includes('2')) {
    return 2;
  }
  if (phaseLower.includes('1')) {
    return 1;
  }
  return 0; // Default for 'early phase 1', 'n/a', 'phase 0', etc.
};

/**
 * Gets Tailwind color classes based on the study phase.
 */
const getPhaseColorClasses = (
  phase?: string,
): { bg: string; darkBg: string; text: string; darkText: string } => {
  if (!phase) {
    return {
      bg: 'bg-gray-200',
      darkBg: 'dark:bg-gray-700',
      text: 'text-gray-700',
      darkText: 'dark:text-gray-400',
    };
  }
  const phaseLower = phase.toLowerCase();
  if (phaseLower.includes('3') || phaseLower.includes('4')) {
    return {
      bg: 'bg-blue-500',
      darkBg: 'dark:bg-blue-600',
      text: 'text-blue-700',
      darkText: 'dark:text-blue-400',
    };
  }
  if (phaseLower.includes('2')) {
    return {
      bg: 'bg-purple-500',
      darkBg: 'dark:bg-purple-600',
      text: 'text-purple-700',
      darkText: 'dark:text-purple-400',
    };
  }
  if (phaseLower.includes('1')) {
    return {
      bg: 'bg-pink-500',
      darkBg: 'dark:bg-pink-600',
      text: 'text-pink-700',
      darkText: 'dark:text-pink-400',
    };
  }
  return {
    bg: 'bg-gray-200',
    darkBg: 'dark:bg-gray-700',
    text: 'text-gray-700',
    darkText: 'dark:text-gray-400',
  };
};

/**
 * Renders a milestone icon (checkmark) based on whether the date is in the past.
 */
const renderMilestoneIcon = (
  dateString?: string,
  size: 'small' | 'large' = 'large',
) => {
  const isPast = isDateInPast(dateString);
  const baseClasses = 'rounded-full flex items-center justify-center border';
  const iconSizeClass = size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
  const svgSizeClass = size === 'small' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const title = isPast ? 'Completed milestone' : 'Pending milestone';

  const completedClasses =
    'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
  const pendingClasses =
    'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
  const completedSvgClasses = 'text-green-600 dark:text-green-300';
  const pendingSvgClasses = 'text-gray-400 dark:text-gray-500';

  return (
    <div
      className={`${baseClasses} ${iconSizeClass} ${isPast ? completedClasses : pendingClasses}`}
    >
      <svg
        className={`${svgSizeClass} ${isPast ? completedSvgClasses : pendingSvgClasses}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true" // Mark as decorative
      >
        <title>{title}</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};

// --- Components ---

export const Text: React.FC<PropsWithChildren> = ({ children }) => {
  const nodes = React.Children.toArray(children);
  const isSingleString = nodes.length === 1 && typeof nodes[0] === 'string';

  return isSingleString ? (
    <div className="prose dark:prose-invert prose-sm sm:prose-base mb-4 max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {nodes[0] as string}
      </ReactMarkdown>
    </div>
  ) : (
    <>{children}</> // Render children directly if not a single string
  );
};

export const Thought: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-300 dark:border-blue-700 rounded">
      <div className="font-medium text-blue-700 dark:text-blue-300 text-sm uppercase tracking-wide mb-1">
        Thought Process
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-sm italic">
        {children}
      </div>
    </div>
  );
};

/**
 * Represents a single item in the study progress timeline.
 */
interface TimelineItemProps {
  label: string;
  dateString?: string;
}
const TimelineItem: React.FC<TimelineItemProps> = ({ label, dateString }) => {
  return (
    <div className="relative mb-4 pl-4">
      {/* Icon positioned absolutely relative to this container */}
      <div className="absolute left-0 -translate-x-1/2 top-0.5 flex items-center justify-center z-10">
        {renderMilestoneIcon(dateString, 'large')}
      </div>
      {/* Text content */}
      <div>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {label}:
        </span>
        <span className="text-gray-600 dark:text-gray-400 ml-1">
          {dateString || 'Not specified'}
        </span>
      </div>
    </div>
  );
};

export const StudyCard: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  ...props // all original props (status, ntcid, phase, …)
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Use useCallback for stable function reference if passed down
  const toggleExpand = useCallback(() => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  }, []);

  const resultsPosted = isDateInPast(props.resulted_posted);
  const numPhaseBars = getPhaseBarCount(props.phase);
  const phaseColors = getPhaseColorClasses(props.phase);

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* NCT ID Title Bar - Clickable Header */}
      {props.ntcid && (
        <div
          className={`px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''
          }`}
          onClick={toggleExpand}
          onKeyDown={(e) => {
            // Keep keyboard accessibility
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleExpand();
            }
          }}
          tabIndex={0} // Make focusable
          role="button" // Semantic role
          aria-expanded={isExpanded} // ARIA state
          aria-controls={`study-card-content-${props.ntcid}`} // Link header to content
        >
          {/* Chevron Icon */}
          <svg
            className={`w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 transform transition-transform flex-shrink-0 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" // Decorative icon
          >
            <title>{isExpanded ? 'Collapse details' : 'Expand details'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>

          {/* NCT ID Link */}
          <a
            href={props.url}
            className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:underline mr-3 flex-shrink-0"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent toggle on link click
          >
            {props.ntcid}
          </a>

          {/* Phase progress bar */}
          {props.phase && (
            <div className="flex items-center mr-3">
              {' '}
              {/* Added margin */}
              <div className="flex space-x-0.5">
                {/* Filled bars */}
                {Array.from({ length: numPhaseBars }).map(() => (
                  // No need for index if using UUID
                  <div
                    key={generateUniqueId()} // Use UUID for key
                    className={`h-1.5 w-8 sm:w-12 md:w-16 ${phaseColors.bg} ${phaseColors.darkBg} rounded-sm`}
                  />
                ))}
                {/* Empty bars */}
                {Array.from({ length: 3 - numPhaseBars }).map(() => (
                  // No need for index if using UUID
                  <div
                    key={generateUniqueId()} // Use UUID for key
                    className="h-1.5 w-8 sm:w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-sm"
                  />
                ))}
              </div>
              <span
                className={`ml-1.5 text-xs font-medium ${phaseColors.text} ${phaseColors.darkText} whitespace-nowrap`}
              >
                {props.phase}
              </span>
            </div>
          )}

          {/* Progress checkmarks in header (Small Icons) - Moved to end */}
          <div className="flex items-center ml-auto space-x-1 flex-shrink-0">
            {renderMilestoneIcon(props.study_start, 'small')}
            {renderMilestoneIcon(props.primary_completion_date, 'small')}
            {renderMilestoneIcon(props.study_completion_date, 'small')}
            {renderMilestoneIcon(props.resulted_posted, 'small')}
          </div>
        </div>
      )}

      {/* Card Content - Conditionally rendered */}
      {/* Use CSS transition or animation library for smoother expand/collapse if desired */}
      {isExpanded && (
        <div className="p-4" id={`study-card-content-${props.ntcid}`}>
          {' '}
          {/* Added ID for aria-controls */}
          {/* Status, Enrollment, Results */}
          {(props.status || props.enrollment || resultsPosted) && (
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {' '}
              {/* Added flex-wrap and gap */}
              {props.status && (
                <span
                  className={`inline-block px-2 py-0.5 text-xs leading-none rounded-full border ${StatusButton(
                    props.status,
                  )}`}
                >
                  {props.status}
                </span>
              )}
              {props.enrollment && (
                <span className="inline-block px-2 py-0.5 text-xs leading-none rounded-full border bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                  Enrollment: {props.enrollment}
                </span>
              )}
              {resultsPosted &&
                props.ntcid && ( // Ensure ntcid exists for the link
                  <a
                    href={`https://clinicaltrials.gov/study/${props.ntcid}?tab=results`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center pl-2 pr-1 py-0.5 text-xs leading-none rounded-full border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors no-underline"
                  >
                    View results
                    <svg
                      className="w-3 h-3 ml-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <title>Right arrow</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}
            </div>
          )}
          {/* Title and Official Title */}
          {props.title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 !mt-0 mb-0 leading-tight">
              {props.title}
            </h3>
          )}
          {props.official_title && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
              {' '}
              {/* Use <p> for semantics */}
              {props.official_title}
            </p>
          )}
          {/* Children (e.g., Text, Thought components) */}
          {children && <div className="mb-4">{children}</div>}
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
            {' '}
            {/* Responsive columns */}
            {/* Left column - Timeline */}
            <div className="md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-4">
              {' '}
              {/* Responsive border/padding */}
              <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Progress
              </div>
              {/* Timeline container */}
              <div className="relative pl-6">
                {' '}
                {/* Padding for icon positioning */}
                {/* Vertical line - Spans between first and last icon */}
                <div
                  className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
                <TimelineItem
                  label="Study Start"
                  dateString={props.study_start}
                />
                <TimelineItem
                  label="Primary Completion"
                  dateString={props.primary_completion_date}
                />
                <TimelineItem
                  label="Study Completion"
                  dateString={props.study_completion_date}
                />
                <TimelineItem
                  label="Results Posted"
                  dateString={props.resulted_posted}
                />
              </div>
            </div>
            {/* Right column - Other details */}
            <div>
              {props.sponsor && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300 block">
                    {' '}
                    {/* Block for stacking */}
                    Sponsor:
                  </span>
                  <div className="text-gray-600 dark:text-gray-400">
                    {props.sponsor}
                  </div>
                </div>
              )}
              {props.intervention && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300 block">
                    Intervention:
                  </span>
                  <div className="text-gray-600 dark:text-gray-400">
                    {props.intervention}
                  </div>
                </div>
              )}
              {props.location && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 block">
                    Location:
                  </span>
                  <div className="text-gray-600 dark:text-gray-400">
                    {props.location}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Other Exported Components (Unchanged) ---

export const Tool: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3 text-sm border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all">
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2 flex-shrink-0">
          <svg
            className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <title>Tool icon</title>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <div className="font-medium text-gray-700 dark:text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export const BasicCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3 text-sm border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all">
      {children}
    </div>
  );
};
