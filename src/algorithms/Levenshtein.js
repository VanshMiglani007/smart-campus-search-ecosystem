// =============================================
// Levenshtein.js — Edit Distance (Dynamic Programming)
// =============================================
// Time Complexity:  O(m × n) where m, n are string lengths
// Space Complexity: O(m × n) for the full DP matrix
// =============================================
// Used for: Typo correction / "Did you mean...?" feature
// Returns the full DP matrix for visualization
// =============================================

/**
 * Compute the Levenshtein (edit) distance between two strings.
 * Returns distance, full DP matrix, and the list of operations.
 *
 * @param {string} source - The source string (what user typed)
 * @param {string} target - The target string (correct word)
 * @returns {{ distance: number, matrix: number[][], operations: Array }}
 */
export function levenshtein(source, target) {
  const m = source.length;
  const n = target.length;

  // Build the DP matrix
  // matrix[i][j] = edit distance between source[0..i-1] and target[0..j-1]
  const matrix = [];

  for (let i = 0; i <= m; i++) {
    matrix[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        // Base case: source is empty → insert all target chars
        matrix[i][j] = j;
      } else if (j === 0) {
        // Base case: target is empty → delete all source chars
        matrix[i][j] = i;
      } else if (source[i - 1].toLowerCase() === target[j - 1].toLowerCase()) {
        // Characters match → no operation needed
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        // Minimum of insert, delete, or replace
        matrix[i][j] = 1 + Math.min(
          matrix[i][j - 1],     // Insert
          matrix[i - 1][j],     // Delete
          matrix[i - 1][j - 1]  // Replace
        );
      }
    }
  }

  // Backtrack to find operations
  const operations = _backtrackOperations(source, target, matrix);

  return {
    distance: matrix[m][n],
    matrix,
    operations,
  };
}

/**
 * Backtrack through the DP matrix to find the sequence of operations
 */
function _backtrackOperations(source, target, matrix) {
  const operations = [];
  let i = source.length;
  let j = target.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && source[i - 1].toLowerCase() === target[j - 1].toLowerCase()) {
      // Match — no operation
      operations.unshift({
        type: 'match',
        position: j,
        sourceChar: source[i - 1],
        targetChar: target[j - 1],
      });
      i--;
      j--;
    } else if (i > 0 && j > 0 && matrix[i][j] === matrix[i - 1][j - 1] + 1) {
      // Replace
      operations.unshift({
        type: 'replace',
        position: j,
        sourceChar: source[i - 1],
        targetChar: target[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && matrix[i][j] === matrix[i][j - 1] + 1) {
      // Insert
      operations.unshift({
        type: 'insert',
        position: j,
        targetChar: target[j - 1],
      });
      j--;
    } else if (i > 0 && matrix[i][j] === matrix[i - 1][j] + 1) {
      // Delete
      operations.unshift({
        type: 'delete',
        position: i,
        sourceChar: source[i - 1],
      });
      i--;
    } else {
      // Fallback for match (shouldn't normally reach here)
      i--;
      j--;
    }
  }

  return operations;
}

/**
 * Find the closest matching word from a word list using Levenshtein distance.
 *
 * @param {string} input - The misspelled input
 * @param {string[]} wordList - Array of correct words to compare against
 * @param {number} threshold - Maximum acceptable distance (default: 2)
 * @returns {{ word: string, distance: number, matrix: number[][], operations: Array } | null}
 */
export function findClosestMatch(input, wordList, threshold = 2) {
  if (!input || !wordList || wordList.length === 0) return null;

  let bestMatch = null;
  let bestDistance = Infinity;
  let bestResult = null;

  for (const word of wordList) {
    const result = levenshtein(input, word);

    if (result.distance < bestDistance) {
      bestDistance = result.distance;
      bestMatch = word;
      bestResult = result;
    }

    // Perfect match found, no need to continue
    if (bestDistance === 0) break;
  }

  if (bestDistance <= threshold && bestMatch) {
    return {
      word: bestMatch,
      distance: bestDistance,
      matrix: bestResult.matrix,
      operations: bestResult.operations,
    };
  }

  return null;
}

/**
 * Get the operation type for a specific cell in the DP matrix
 * Used for color-coding the matrix visualization
 *
 * @returns {'match' | 'replace' | 'insert' | 'delete' | 'base'}
 */
export function getCellType(matrix, source, target, i, j) {
  if (i === 0 && j === 0) return 'base';
  if (i === 0) return 'insert';
  if (j === 0) return 'delete';

  if (source[i - 1].toLowerCase() === target[j - 1].toLowerCase()) {
    return 'match';
  }

  const current = matrix[i][j];
  const diagonal = matrix[i - 1][j - 1];
  const up = matrix[i - 1][j];
  const left = matrix[i][j - 1];

  if (current === diagonal + 1) return 'replace';
  if (current === left + 1) return 'insert';
  if (current === up + 1) return 'delete';

  return 'match';
}

export default levenshtein;
