module.exports = {
  rootDir: "./",
  roots: ['<rootDir>'],
  projects: [
    { 
      displayName: "api",
      testMatch: ['**/__tests__/**/*.spec.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/packages/api/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/packages/api/jest.config.setup.js'],
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['__tests__'],
      testEnvironment: "node",
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/packages/api/tsconfig.json"
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
        '^~/(.*)$': '<rootDir>/packages/web/src/$1',
      },
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['__tests__'],
      testEnvironment: "node",
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/packages/web/tsconfig.json"
        }
      },
    },
    { 
      displayName: "common",
      testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.spec.tsx'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.tsx$': 'ts-jest',
      },
      moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/packages/common/src/$1',
      },
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['__tests__'],
      testEnvironment: "node",
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/packages/common/tsconfig.json"
        }
      },
    },
  ],
}; 
