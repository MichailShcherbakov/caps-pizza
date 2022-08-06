module.exports = {
  rootDir: "./",
  roots: ['<rootDir>/api'],
  projects: [
    { 
      displayName: "api",
      testMatch: ['**/__tests__/**/*.spec.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/api/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/api/jest.config.setup.js'],
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['__tests__'],
      testEnvironment: "node",
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/api/tsconfig.json"
        }
      },
    },
    { 
      displayName: "web",
      testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.spec.tsx'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
      },
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/api/src/$1',
      },
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['__tests__'],
      testEnvironment: "node",
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/api/tsconfig.json"
        }
      },
    },
  ],
}; 
