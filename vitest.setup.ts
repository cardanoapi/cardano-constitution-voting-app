import { server } from '@/../__mocks__/server';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  vi.mock('next/router', () => require('next-router-mock'));
  server.listen();
});

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Mock matchMedia for Toast
global.matchMedia =
  global.matchMedia ||
  function (): {
    matches: false;
    addListener: () => void;
    removeListener: () => void;
    // eslint-disable-next-line indent
  } {
    return {
      matches: false,
      addListener: (): void => {},
      removeListener: (): void => {},
    };
  };
