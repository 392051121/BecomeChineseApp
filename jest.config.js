module.exports = {
  preset: 'jest-expo',

  // Setup files for extended matchers
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // Transform ignore patterns for React Native modules
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|lucide-react-native|d3(-[a-zA-Z0-9]+)*|internmap)'
  ],

  // Module name mapper for path aliases and mocks
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^expo-file-system$': '<rootDir>/src/__mocks__/expo-file-system.js',
    '^expo-sharing$': '<rootDir>/src/__mocks__/expo-sharing.js',
    '^react-native-view-shot$': '<rootDir>/src/__mocks__/react-native-view-shot.js',
  },

  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.style.{js,jsx}',
    '!src/data/**',
    '!src/assets/**',
    '!src/__tests__/**',
  ],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js',
  ],

  // Coverage thresholds - start lower and increase over time
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },

  // Test environment
  testEnvironment: 'node',

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};