module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: './',
  testRegex: '\\.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['__tests__'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.config.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/api/dist/'],
};
