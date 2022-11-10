import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

// Load the config which holds the path aliases.
// eslint-disable-next-line import/extensions
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    // This has to match the baseUrl defined in tsconfig.json.
    prefix: '<rootDir>',
  }),

  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;
