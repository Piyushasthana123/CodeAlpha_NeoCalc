const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://neocalc.onrender.com/api';

/**
 * Calculates a mathematical expression via the backend API.
 * @param {string} expression
 * @returns {Promise<{expression: string, result: number|string}>}
 */
export async function calculateExpression(expression) {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || 'Calculation error';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves past calculation history from the backend.
 * @returns {Promise<Array<{id: number, expression: string, result: number, timestamp: string}>>}
 */
export async function getHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) {
      throw new Error('Failed to retrieve history');
    }
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('History fetch error:', error);
    return [];
  }
}

/**
 * Clears all calculation history records on the backend.
 * @returns {Promise<string>}
 */
export async function clearHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to clear history');
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('History clear error:', error);
    throw error;
  }
}
