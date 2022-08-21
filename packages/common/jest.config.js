module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: "^.+spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["__tests__/*"],
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
