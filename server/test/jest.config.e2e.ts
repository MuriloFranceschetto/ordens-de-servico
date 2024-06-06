import { Config } from "jest";
import defaultConfig from './jest.config';

const config: Config = {
    ...defaultConfig,
    rootDir: ".",
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.e2e-spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>"
    },
    testEnvironment: 'node',
    preset: 'ts-jest',
    modulePaths: ['<rootDir>'],
    modulePathIgnorePatterns: ['src/typings'],
    testPathIgnorePatterns: [
        '/node_modules./',
        '<rootDir>/(coverage|dist|lib|tmp)./',
    ],
};

export default config;