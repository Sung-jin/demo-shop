import type {Config} from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    rootDir: './',
    testRegex: '.*\.spec\.(t|j)sx?$',
    transform: {
      "^.+\.(t|j)sx?$": "ts-jest"
    },
    testEnvironment: 'node',
    moduleNameMapper: {
      '@/(.*)$': '<rootDir>/src/$1',
      '#/(.*)$': '<rootDir>/tests/$1'
    }
  };
}
