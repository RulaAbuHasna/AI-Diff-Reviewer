import { expect, test, describe } from 'vitest';
import { reviewLatestCommit } from '../src/reviewer.js';

describe('PR Reviewer', () => {
  test('should handle empty diff', async () => {
    const result = await reviewLatestCommit({ verbose: false });
    expect(result).toContain('No changes found');
  });

  // Add more tests as functionality expands
});