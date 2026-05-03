import { createClient } from '@supabase/supabase-js';

// =============================================
// Replace these with your Supabase project credentials
// Find them at: supabase.com → Your Project → Settings → API
// =============================================
const SUPABASE_URL = 'https://fdgyovsphrsrfqfmfbiz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3lvdnNwaHJzcmZxZm1mYml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjQ3NDcsImV4cCI6MjA5MzQwMDc0N30.SYrSx6PoMKLkdNWg8eByKlmyCYs4gK8CyaH-ms1NLrk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// Session Management
// =============================================
// Generate or retrieve a persistent session ID using cookies
function getSessionId() {
  // Try to get existing session from localStorage
  let sessionId = localStorage.getItem('dptrek_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('dptrek_session_id', sessionId);
  }
  return sessionId;
}

export const sessionId = getSessionId();

// Create or update session record
export async function initSession(textSize) {
  try {
    const { error } = await supabase
      .from('sessions')
      .upsert({
        session_id: sessionId,
        text_size: textSize || 'medium',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id' });

    if (error) console.error('Session init error:', error);
  } catch (err) {
    console.error('Session init failed:', err);
  }
}

// =============================================
// Save Reflection Responses
// =============================================
export async function saveReflectionResponse({
  moduleId,
  moduleTitle,
  questionId,
  questionText,
  answerType, // 'single_select' or 'feeling_combined'
  selectedOption,
  selectedOptionText,
  otherText,
  comment,
  selectedFeelings,
  intensity,
}) {
  try {
    const { error } = await supabase
      .from('reflection_responses')
      .insert({
        session_id: sessionId,
        module_id: moduleId,
        module_title: moduleTitle,
        question_id: questionId,
        question_text: questionText,
        answer_type: answerType,
        selected_option: selectedOption || null,
        selected_option_text: selectedOptionText || null,
        other_text: otherText || null,
        comment: comment || null,
        selected_feelings: selectedFeelings || null,
        intensity: intensity || null,
      });

    if (error) console.error('Save reflection error:', error);
  } catch (err) {
    console.error('Save reflection failed:', err);
  }
}

// =============================================
// Save Test Results
// =============================================
export async function saveTestResult({ moduleId, moduleTitle, score, total, passed }) {
  try {
    const { error } = await supabase
      .from('test_results')
      .insert({
        session_id: sessionId,
        module_id: moduleId,
        module_title: moduleTitle,
        score,
        total,
        passed,
      });

    if (error) console.error('Save test result error:', error);
  } catch (err) {
    console.error('Save test result failed:', err);
  }
}

// =============================================
// Save Module Completion
// =============================================
export async function saveModuleCompletion({ moduleId, moduleTitle }) {
  try {
    const { error } = await supabase
      .from('module_completions')
      .insert({
        session_id: sessionId,
        module_id: moduleId,
        module_title: moduleTitle,
      });

    if (error) console.error('Save module completion error:', error);
  } catch (err) {
    console.error('Save module completion failed:', err);
  }
}

// =============================================
// Save Feedback
// =============================================
export async function saveFeedback({ name, message }) {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert({
        session_id: sessionId,
        name: name || null,
        message,
      });

    if (error) console.error('Save feedback error:', error);
    return !error;
  } catch (err) {
    console.error('Save feedback failed:', err);
    return false;
  }
}

// =============================================
// Save Survey Response
// =============================================
export async function saveSurveyResponse(responses) {
  try {
    const { error } = await supabase
      .from('survey_responses')
      .insert({
        session_id: sessionId,
        responses,
      });

    if (error) console.error('Save survey error:', error);
    return !error;
  } catch (err) {
    console.error('Save survey failed:', err);
    return false;
  }
}

// =============================================
// Track Phase Actions
// =============================================
export async function trackPhaseAction({ moduleId, moduleTitle, phase, action }) {
  try {
    const { error } = await supabase
      .from('phase_tracking')
      .insert({
        session_id: sessionId,
        module_id: moduleId,
        module_title: moduleTitle,
        phase,
        action,
      });

    if (error) console.error('Track phase error:', error);
  } catch (err) {
    console.error('Track phase failed:', err);
  }
}
