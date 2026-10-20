/**
 * API Service for NeoCalc
 * Handles calculation and persistent history with Render backend & LocalStorage fallback.
 */

// Normalize API URL to avoid missing '/api', double slashes, or trailing slash issues
function resolveApiBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  if (!envUrl) {
    // Default production endpoint on Render
    return 'https://neocalc.onrender.com/api';
  }

  // Remove any trailing slashes
  let cleanUrl = envUrl.replace(/\/+$/, '');

  // If full domain was supplied without /api, append /api
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    if (!cleanUrl.endsWith('/api')) {
      cleanUrl = `${cleanUrl}/api`;
    }
  } else if (!cleanUrl.startsWith('/api') && cleanUrl !== '') {
    cleanUrl = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  }

  return cleanUrl;
}

const API_BASE_URL = resolveApiBaseUrl();
const STORAGE_HISTORY_KEY = 'neocalc_calculation_history';

/**
 * LocalStorage Helpers for offline resilience & Render free-tier cold start / disk reset preservation.
 */
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalHistoryItem(item) {
  try {
    const current = getLocalHistory();
    // Prepend new item, remove duplicates if matching expression and result
    const filtered = current.filter(
      (h) => !(h.expression === item.expression && Math.abs(h.result - item.result) < 1e-9)
    );
    const updated = [item, ...filtered].slice(0, 100);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearLocalHistory() {
  try {
    localStorage.removeItem(STORAGE_HISTORY_KEY);
  } catch {}
}

/**
 * Safe local client-side evaluation fallback.
 * Used when backend is sleeping (Render cold start) or unreachable.
 */
export function evaluateLocally(expression) {
  if (!expression || !expression.trim()) {
    throw new Error('Invalid mathematical expression');
  }

  let clean = expression.trim();
  // Normalize symbols
  clean = clean.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Verify only allowed characters
  if (!/^[0-9+\-*/().\s]+$/.test(clean)) {
    throw new Error('Invalid mathematical expression');
  }

  const noSpaces = clean.replace(/\s+/g, '');

  // Disallow consecutive operators
  if (/[+\-*/]{2,}/.test(noSpaces)) {
    throw new Error('Invalid mathematical expression');
  }

  // Disallow ending with operator or dot
  if (/[+\-*/.]$/.test(noSpaces)) {
    throw new Error('Incomplete expression');
  }

  // Disallow starting with * or /
  if (/^[*/.]/.test(noSpaces)) {
    throw new Error('Invalid mathematical expression');
  }

  // Check division by zero before evaluation
  if (/\/0(?![.\d])/.test(noSpaces)) {
    throw new Error('Cannot divide by zero');
  }

  // Normalize leading decimals like .5 -> 0.5
  clean = clean.replace(/(?<!\d)\.(\d+)/g, '0.$1');

  try {
    // eslint-disable-next-line no-new-func
    const res = Function(`"use strict"; return (${clean})`)();
    if (typeof res !== 'number' || !isFinite(res)) {
      throw new Error('Calculation error');
    }
    // Clean float rounding
    const rounded = Math.round(res * 1e10) / 1e10;
    return rounded;
  } catch (err) {
    if (err.message === 'Cannot divide by zero') throw err;
    throw new Error('Invalid mathematical expression');
  }
}

/**
 * Calculates a mathematical expression via the backend API with fallback.
 * @param {string} expression
 * @returns {Promise<{expression: string, result: number|string}>}
 */
export async function calculateExpression(expression) {
  const cleanExpr = expression.trim();

  try {
    // Set a reasonable timeout so users aren't frozen during Render cold starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression: cleanExpr }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.ok && data) {
      // Calculation succeeded on server
      saveLocalHistoryItem({
        id: Date.now(),
        expression: data.expression,
        result: data.result,
        timestamp: new Date().toISOString(),
      });
      return data;
    }

    // Mathematical error returned by backend (e.g. 400 division by zero, 422 invalid expression)
    if (response.status === 400 || response.status === 422) {
      const errorMsg = (data && data.detail) || 'Calculation error';
      throw new Error(errorMsg);
    }

    // If server returned 404 or server error (502/503), throw to trigger local fallback
    throw new Error(`Server returned status ${response.status}`);
  } catch (error) {
    // Re-throw explicit math errors directly to display appropriate error banner
    if (
      error.message === 'Cannot divide by zero' ||
      error.message === 'Incomplete expression' ||
      error.message.includes('Invalid mathematical expression')
    ) {
      throw error;
    }

    // Fallback: evaluate locally and save to persistent local history
    console.warn('Backend calculation unavailable or cold-starting, evaluating locally:', error.message);
    const result = evaluateLocally(cleanExpr);

    saveLocalHistoryItem({
      id: Date.now(),
      expression: cleanExpr,
      result: result,
      timestamp: new Date().toISOString(),
    });

    return { expression: cleanExpr, result };
  }
}

/**
 * Retrieves past calculation history from backend, merged with local storage.
 * @returns {Promise<Array<{id: number, expression: string, result: number, timestamp: string}>>}
 */
export async function getHistory() {
  const localHistory = getLocalHistory();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/history`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const serverHistory = data.history || [];

      // Merge server history with local history
      const itemMap = new Map();

      // Backend entries
      for (const item of serverHistory) {
        const key = `${item.expression}_${item.result}`;
        itemMap.set(key, item);
      }

      // Local entries not yet on server
      for (const item of localHistory) {
        const key = `${item.expression}_${item.result}`;
        if (!itemMap.has(key)) {
          itemMap.set(key, item);
        }
      }

      const merged = Array.from(itemMap.values());
      // Sort newest first
      merged.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      // Cache back to LocalStorage
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(merged.slice(0, 100)));
      } catch {}

      return merged.slice(0, 100);
    }
  } catch (error) {
    console.warn('History fetch from backend failed, using local history cache:', error.message);
  }

  return localHistory;
}

/**
 * Clears all calculation history records on backend and local storage.
 * @returns {Promise<string>}
 */
export async function clearHistory() {
  clearLocalHistory();

  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const data = await response.json();
      return data.message || 'Calculation history cleared successfully';
    }
  } catch (error) {
    console.warn('History clear on backend failed:', error);
  }

  return 'Calculation history cleared successfully';
}
