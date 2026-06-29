export const cacheDirectory = 'cache://';
export const writeAsStringAsync = jest.fn(() => Promise.resolve());
export const readAsStringAsync = jest.fn(() => Promise.resolve(''));
export const deleteAsync = jest.fn(() => Promise.resolve());
export const getInfoAsync = jest.fn(() => Promise.resolve({ exists: false }));
