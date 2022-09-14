module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: "^.+spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "__tests__/*",
    "utils/*",
    "db/*",
    "config.ts",
    "env.ts",
    "vars.ts",
  ],
  testEnvironment: "node",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.config.setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
