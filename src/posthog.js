import posthog from 'posthog-js';

// Initialize PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(
      'phc_PYstlQ5v5rqOBBNa1FwzYcTbCA6GpTcV4V8JDUnxbU8', // Replace with your actual PostHog API key
      {
        api_host: 'https://app.posthog.com', // Or your self-hosted URL
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded');
          }
        },
        capture_pageview: true, // Automatically capture page views
        capture_pageleave: true, // Track when users leave
        autocapture: false, // Disable automatic event capture (we'll track manually)
        persistence: 'localStorage', // Store data in localStorage
        disable_session_recording: false, // Enable session recordings (optional)
      }
    );
  }
};

// Track module events
export const trackModuleStart = (moduleId, moduleName) => {
  posthog.capture('module_started', {
    module_id: moduleId,
    module_name: moduleName,
  });
};

export const trackPhaseComplete = (moduleId, moduleName, phaseName) => {
  posthog.capture('phase_completed', {
    module_id: moduleId,
    module_name: moduleName,
    phase: phaseName,
  });
};

export const trackReflectionSubmit = (moduleId, moduleName, answers, otherText, comments) => {
  posthog.capture('reflection_submitted', {
    module_id: moduleId,
    module_name: moduleName,
    answers: answers,
    has_other_text: Object.keys(otherText || {}).length > 0,
    has_comments: Object.keys(comments || {}).length > 0,
  });
};

export const trackTestComplete = (moduleId, moduleName, score, total, passed) => {
  posthog.capture('test_completed', {
    module_id: moduleId,
    module_name: moduleName,
    score: score,
    total: total,
    passed: passed,
    percentage: (score / total) * 100,
  });
};

export const trackModuleComplete = (moduleId, moduleName) => {
  posthog.capture('module_completed', {
    module_id: moduleId,
    module_name: moduleName,
  });
};

export const trackSurveyClick = (moduleId, moduleName) => {
  posthog.capture('post_survey_clicked', {
    module_id: moduleId,
    module_name: moduleName,
  });
};

export const trackInteractiveExampleStep = (moduleId, moduleName, exampleName, step, totalSteps) => {
  posthog.capture('interactive_example_step', {
    module_id: moduleId,
    module_name: moduleName,
    example_name: exampleName,
    step: step,
    total_steps: totalSteps,
  });
};

export const trackTextSizeChange = (size) => {
  posthog.capture('text_size_changed', {
    size: size,
  });
};

export const trackHomePageLoad = () => {
  posthog.capture('home_page_loaded');
};

export const trackModuleClick = (moduleId, moduleName) => {
  posthog.capture('module_clicked', {
    module_id: moduleId,
    module_name: moduleName,
  });
};

// Identify user (optional - only if you have user IDs)
export const identifyUser = (userId, traits = {}) => {
  posthog.identify(userId, traits);
};

export default posthog;