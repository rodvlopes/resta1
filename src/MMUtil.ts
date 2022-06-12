/**
 * This file contains only those "must-to-mock" functions!
 * */

//SyntaxError: Cannot use 'import.meta' outside a module
//This error occur in unit tests. So it required to mock this call.
export const buildWorker = () =>
  new Worker(new URL('./SearchWorker.ts', import.meta.url), { type: 'module' })

export const userPrefesDark = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
