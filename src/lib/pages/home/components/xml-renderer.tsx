import { useState, useEffect } from 'react';

interface CardProps {
  status?: string;
  ntcid: string;
  phase?: string;
  enrollment?: number;
  title: string;
  url: string;
  official_title?: string;
  study_start?: string;
  primary_completion_date?: string;
  study_completion_date?: string;
  resulted_posted?: string;
  intervention?: string;
  sponsor?: string;
  location?: string;
}

interface AnswerProps {
  text?: string;
  cards?: CardProps[];
}

const StatusButton = (status: string): string => {
  // Convert to lowercase for case-insensitive comparison
  const statusLower = status.toLowerCase();
  
  // Green theme for active trials - exact status matching
  if (statusLower === 'recruiting' || statusLower === 'active, not recruiting') {
    return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700';
  }
  
  // Blue theme for completed trials
  if (statusLower === 'completed') {
    return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700';
  }
  
  // Red theme for terminated/withdrawn/suspended trials
  if (statusLower === 'terminated' || statusLower === 'withdrawn' || statusLower === 'suspended') {
    return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700';
  }
  
  // Grey theme for not yet recruiting, enrolling by invitation, unknown status, or any other status
  if (statusLower === 'not yet recruiting' || statusLower === 'enrolling by invitation' || statusLower === 'unknown') {
    return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600';
  }
  
  // Default to grey for any other status
  return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600';
};

const Card = (props: CardProps) => {
  // State to manage expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(true);

  // Function to toggle the state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to check if a date is in the past
  const isDateInPast = (dateString?: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date < new Date();
  };

  // Function to determine how many phase bars to show
  const getPhaseBarCount = (phase?: string): number => {
    if (!phase) return 0;
    
    // Convert to lowercase for case-insensitive comparison
    const phaseLower = phase.toLowerCase();
    
    // Look for highest phase number mentioned
    if (phaseLower.includes('3') || phaseLower.includes('4')) {
      return 3;
    } else if (phaseLower.includes('2')) {
      return 2;
    } else if (phaseLower.includes('1')) {
      return 1;
    }
    
    return 0;
  };

  // Function to get color class based on phase
  const getPhaseColorClasses = (phase?: string): { bg: string, darkBg: string, text: string, darkText: string } => {
    if (!phase) return { 
      bg: 'bg-gray-200', 
      darkBg: 'dark:bg-gray-700', 
      text: 'text-gray-700', 
      darkText: 'dark:text-gray-400' 
    };
    
    // Convert to lowercase for case-insensitive comparison
    const phaseLower = phase.toLowerCase();
    
    // Phase 3 or 4: Blue
    if (phaseLower.includes('3') || phaseLower.includes('4')) {
      return { 
        bg: 'bg-blue-500', 
        darkBg: 'dark:bg-blue-600', 
        text: 'text-blue-700', 
        darkText: 'dark:text-blue-400' 
      };
    } 
    // Phase 2: Purple (keep current color)
    else if (phaseLower.includes('2')) {
      return { 
        bg: 'bg-purple-500', 
        darkBg: 'dark:bg-purple-600', 
        text: 'text-purple-700', 
        darkText: 'dark:text-purple-400' 
      };
    } 
    // Phase 1: Red-pink
    else if (phaseLower.includes('1')) {
      return { 
        bg: 'bg-pink-500', 
        darkBg: 'dark:bg-pink-600', 
        text: 'text-pink-700', 
        darkText: 'dark:text-pink-400' 
      };
    }
    
    // Default: Gray
    return { 
      bg: 'bg-gray-200', 
      darkBg: 'dark:bg-gray-700', 
      text: 'text-gray-700', 
      darkText: 'dark:text-gray-400' 
    };
  };

  // Check if results have been posted
  const resultsPosted = isDateInPast(props.resulted_posted);

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* NCT ID Title Bar - Now clickable */}
      {props.ntcid && (
        <div 
          className={`px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          onClick={toggleExpand}
        >
          {/* Chevron Icon Indicator - On the left */}
          <svg className={`w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          
          <a href={props.url} className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:underline mr-3" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {props.ntcid}
          </a>
          
          {/* Phase progress bar */}
          {props.phase && (
            <div className="flex items-center">
              <div className="flex space-x-0.5">
                {Array.from({ length: getPhaseBarCount(props.phase) }).map((_, index) => {
                  const colorClasses = getPhaseColorClasses(props.phase);
                  return (
                    <div 
                      key={index} 
                      className={`h-1.5 w-8 sm:w-12 md:w-16 ${colorClasses.bg} ${colorClasses.darkBg} rounded-sm`}
                    />
                  );
                })}
                {/* Fill remaining slots with empty bars if less than 3 */}
                {Array.from({ length: 3 - getPhaseBarCount(props.phase) }).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-1.5 w-8 sm:w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-sm"
                  />
                ))}
              </div>
              <span className={`ml-1.5 text-xs font-medium ${getPhaseColorClasses(props.phase).text} ${getPhaseColorClasses(props.phase).darkText}`}>
                {props.phase}
              </span>
            </div>
          )}
          
          {/* Progress checkmarks in header */}
          <div className="flex items-center ml-auto space-x-1">
            {/* Study Start */}
            <div className="flex items-center justify-center">
              {isDateInPast(props.study_start) ? (
                <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                  <svg className="h-2 w-2 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                  <svg className="h-2 w-2 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Primary Completion */}
            <div className="flex items-center justify-center">
              {isDateInPast(props.primary_completion_date) ? (
                <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                  <svg className="h-2 w-2 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                  <svg className="h-2 w-2 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Study Completion */}
            <div className="flex items-center justify-center">
              {isDateInPast(props.study_completion_date) ? (
                <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                  <svg className="h-2 w-2 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                  <svg className="h-2 w-2 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Results Posted */}
            <div className="flex items-center justify-center">
              {isDateInPast(props.resulted_posted) ? (
                <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                  <svg className="h-2 w-2 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                  <svg className="h-2 w-2 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Content - Conditionally rendered */}
      {isExpanded && (
        <div className="p-4">
          {/* Status and Enrollment buttons */}
          {(props.status || props.enrollment || resultsPosted) && (
            <div className="flex items-center mb-2">
              {props.status && (
                <span className={`inline-block px-2 py-0.5 text-xs leading-none rounded-full border ${StatusButton(props.status)}`}>
                  {props.status}
                </span>
              )}
              {props.enrollment && (
                <span className="ml-2 inline-block px-2 py-0.5 text-xs leading-none rounded-full border bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                  Enrollment: {props.enrollment}
                </span>
              )}
              {resultsPosted && (
                <a 
                  href={`https://clinicaltrials.gov/study/${props.ntcid}?tab=results`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center pl-2 pr-1 py-0.5 text-xs leading-none rounded-full border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors no-underline"
                >
                  View results
                  <svg className="w-3 h-3 ml-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              )}
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 !mt-0 mb-0 leading-none">{props.title}</h3>

          {props.official_title && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
              {props.official_title}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
            {/* Left column - Timeline */}
            <div className="border-r border-gray-200 dark:border-gray-700 pr-4">
              <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Progress</div>
              
              {/* Timeline container */}
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                {/* Study Start */}
                <div className="relative mb-4 pl-4">
                  <div className="absolute left-0 -translate-x-1/2 top-0.5 flex items-center justify-center z-10">
                    {isDateInPast(props.study_start) ? (
                      <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                        <svg className="h-2.5 w-2.5 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                        <svg className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Study Start:</span> 
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{props.study_start || 'Not specified'}</span>
                  </div>
                </div>
                
                {/* Primary Completion */}
                <div className="relative mb-4 pl-4">
                  <div className="absolute left-0 -translate-x-1/2 top-0.5 flex items-center justify-center z-10">
                    {isDateInPast(props.primary_completion_date) ? (
                      <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                        <svg className="h-2.5 w-2.5 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                        <svg className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Primary Completion:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{props.primary_completion_date || 'Not specified'}</span>
                  </div>
                </div>
                
                {/* Study Completion */}
                <div className="relative mb-4 pl-4">
                  <div className="absolute left-0 -translate-x-1/2 top-0.5 flex items-center justify-center z-10">
                    {isDateInPast(props.study_completion_date) ? (
                      <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                        <svg className="h-2.5 w-2.5 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                        <svg className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Study Completion:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{props.study_completion_date || 'Not specified'}</span>
                  </div>
                </div>
                
                {/* Results Posted */}
                <div className="relative pl-4">
                  <div className="absolute left-0 -translate-x-1/2 top-0.5 flex items-center justify-center z-10">
                    {isDateInPast(props.resulted_posted) ? (
                      <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center border border-green-300 dark:border-green-700">
                        <svg className="h-2.5 w-2.5 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                        <svg className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Results Posted:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{props.resulted_posted || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Other details */}
            <div>
              {props.sponsor && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Sponsor:</span>
                  <div className="text-gray-600 dark:text-gray-400">{props.sponsor}</div>
                </div>
              )}
              {props.intervention && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Intervention:</span>
                  <div className="text-gray-600 dark:text-gray-400">{props.intervention}</div>
                </div>
              )}
              {props.location && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                  <div className="text-gray-600 dark:text-gray-400">{props.location}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ToolDetail = ({ content }: { content: string }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3 text-sm border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all">
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
          <svg className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <div className="font-medium text-gray-700 dark:text-gray-200">{content}</div>
      </div>
    </div>
  );
};

export const XMLRenderer = ({ content }: { content: string }) => {
  const [isStreaming, setIsStreaming] = useState(true);
  
  // Set streaming to false after content seems complete
  useEffect(() => {
    // If we have complete XML structure, consider streaming done
    if (content.includes('</response>') && !content.endsWith('<')) {
      const timer = setTimeout(() => {
        setIsStreaming(false);
      }, 1000); // Short delay to ensure content is fully loaded
      return () => clearTimeout(timer);
    }
  }, [content]);

  // Extract streaming content from text tag
  const extractStreamingText = (xml: string): string | undefined => {
    const textMatch = xml.match(/<text>([\s\S]*?)(<\/text>|$)/);
    return textMatch ? textMatch[1] : undefined;
  };

  try {
    // Attempt to repair incomplete XML by adding missing closing tags
    const repairedXml = repairIncompleteXml(content);
    
    // While streaming, also try to extract partial text content
    const streamingText = isStreaming ? extractStreamingText(content) : undefined;
    
    // Parse XML content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(repairedXml, "text/xml");
    
    // Even if there are parsing errors, try to extract what's available
    const hasParseErrors = xmlDoc.getElementsByTagName("parsererror").length > 0;
    
    // Extract data from XML according to schema - safely handle missing elements
    const thoughtElement = xmlDoc.getElementsByTagName("thought")[0];
    const thought = thoughtElement ? thoughtElement.textContent : undefined;

    const toolDetailElements = xmlDoc.getElementsByTagName("tool_details");
    const toolDetails = Array.from(toolDetailElements).map(tool => tool.textContent || "");
    
    const answerElement = xmlDoc.getElementsByTagName("answer")[0];
    const answer: AnswerProps = { text: "", cards: [] };
    
    if (answerElement) {
      const textElement = answerElement.getElementsByTagName("text")[0];
      answer.text = textElement ? textElement.textContent || "" : undefined;
      
      const cardElements = answerElement.getElementsByTagName("card");
      answer.cards = Array.from(cardElements).map(card => {
        const getElementText = (name: string) => {
          const element = card.getElementsByTagName(name)[0];
          return element ? element.textContent || "" : undefined;
        };
        
        const getElementNumber = (name: string) => {
          const text = getElementText(name);
          return text ? Number.parseInt(text, 10) : undefined;
        };
        
        return {
          status: getElementText("status"),
          ntcid: getElementText("ntcid") || "",
          phase: getElementText("phase"),
          enrollment: getElementNumber("enrollment"),
          title: getElementText("title") || "",
          url: getElementText("url") || "",
          official_title: getElementText("official_title"),
          study_start: getElementText("study_start"),
          primary_completion_date: getElementText("primary_completion_date"),
          study_completion_date: getElementText("study_completion_date"),
          resulted_posted: getElementText("resulted_posted"),
          intervention: getElementText("intervention"),
          sponsor: getElementText("sponsor"),
          location: getElementText("location")
        };
      });
    }

    // If no valid data was extracted, try to show raw content in a more digestible way
    if (!thought && toolDetails.length === 0 && !answer.text && (!answer.cards || answer.cards.length === 0)) {
      if (hasParseErrors) {
        return (
          <div className="xml-renderer">
            <div className="italic text-gray-500 text-sm mb-2">Showing partial content while response is streaming...</div>
            <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              {formatRawContent(content)}
            </pre>
          </div>
        );
      }
    }

    // Render the parsed content
    return (
      <div className="xml-renderer">
        {isStreaming && (
          <div className="flex items-center justify-center my-4">
            <div className="italic font-normal text-gray-500 dark:text-gray-400 pr-1 pb-0.5">
              All of our agents are currently busy... working for you :)
            </div>
          </div>
        )}
        
        {/* Thought section - now displayed elegantly */}
        {thought && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-300 dark:border-blue-700 rounded">
            <div className="font-medium text-blue-700 dark:text-blue-300 text-sm uppercase tracking-wide mb-1">Thought Process</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm italic">{thought}</div>
          </div>
        )}

        {/* Tool details section */}
        {toolDetails && toolDetails.length > 0 && (
          <div className="mb-4">
            <div className="font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-2">Actions Taken</div>
            {toolDetails.map((detail, index) => (
              <ToolDetail key={`tool-${index}`} content={detail} />
            ))}
          </div>
        )}

        {/* Answer text - show streaming content if available */}
        {(answer.text || streamingText) && (
          <div className="prose dark:prose-invert prose-sm sm:prose-base mb-4 max-w-none">
            {streamingText ? 
              streamingText.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            : 
              answer.text?.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            }
          </div>
        )}

        {/* Study cards */}
        {answer.cards && answer.cards.length > 0 && (
          <div className="space-y-3">
            {answer.cards.map((card, index) => (
              <Card key={`card-${index}`} {...card} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error parsing XML content:", error);
    // Fallback to displaying raw content in a more readable way
    return (
      <div className="xml-renderer">
        <div className="italic text-gray-500 text-sm mb-2">Content is being streamed...</div>
        <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          {formatRawContent(content)}
        </pre>
      </div>
    );
  }
};

// Format raw content for better readability
const formatRawContent = (content: string): string => {
  // Extract XML tags for highlighting
  return content
    .replace(/(<[^>]+>)/g, '\n$1\n')
    .replace(/\n\s*\n/g, '\n');
};

// Helper function to try to repair incomplete XML
const repairIncompleteXml = (xml: string): string => {
  if (!xml.trim().startsWith('<?xml') && !xml.trim().startsWith('<response')) {
    // Not XML, return as is
    return xml;
  }
  
  let repairedXml = xml;
  
  // Check if we have an opening response tag but no closing one
  if (repairedXml.includes('<response') && !repairedXml.includes('</response>')) {
    repairedXml += '</response>';
  }
  
  // Check common tags that might be incomplete
  const tagPairs = [
    ['<thought>', '</thought>'],
    ['<tool>', '</tool>'],
    ['<tool_details>', '</tool_details>'],
    ['<answer>', '</answer>'],
    ['<text>', '</text>'],
    ['<card>', '</card>'],
    ['<name>', '</name>'],
    ['<parameters>', '</parameters>'],
    ['<result>', '</result>'],
    ['<status>', '</status>'],
    ['<ntcid>', '</ntcid>'],
    ['<phase>', '</phase>'],
    ['<enrollment>', '</enrollment>'],
    ['<title>', '</title>'],
    ['<url>', '</url>'],
    ['<official_title>', '</official_title>'],
    ['<study_start>', '</study_start>'],
    ['<primary_completion_date>', '</primary_completion_date>'],
    ['<study_completion_date>', '</study_completion_date>'],
    ['<resulted_posted>', '</resulted_posted>'],
    ['<intervention>', '</intervention>'],
    ['<sponsor>', '</sponsor>'],
    ['<location>', '</location>']
  ];
  
  for (const [openTag, closeTag] of tagPairs) {
    const lastOpenTagPos = repairedXml.lastIndexOf(openTag);
    const lastCloseTagPos = repairedXml.lastIndexOf(closeTag);
    
    // If we have an opening tag without a matching closing tag
    if (lastOpenTagPos > -1 && (lastCloseTagPos === -1 || lastOpenTagPos > lastCloseTagPos)) {
      repairedXml += closeTag;
    }
  }
  
  return repairedXml;
}; 