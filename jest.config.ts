export default {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@input/(.*)': ['<rootDir>/input/$1'],
    '^@output/(.*)': ['<rootDir>/output/$1'],
    '^@data/(.*)': ['<rootDir>/src/data/$1'],
    '^@domain/(.*)': ['<rootDir>/src/domain/$1'],
    '^@main/(.*)': ['<rootDir>/src/main/$1'],
    '^@services/(.*)': ['<rootDir>/src/services/$1'],
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).ts'],
  testEnvironment: 'node',
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.(test|spec).ts'],
  coverageReporters: ['text-summary', 'lcov'],
}
