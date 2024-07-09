import { Config } from "jest";
import defaultConfig from './jest.config';

const config: Config = {
    ...defaultConfig,
    testRegex: '.spec.ts$',
    moduleNameMapper: {
        "^src(.*)": "<rootDir>/$1",
        "^config(.*)": "<rootDir>/../config/$1",
    },
    verbose: true,
    preset: 'ts-jest',
    modulePaths: ['<rootDir>'],
    modulePathIgnorePatterns: ['src/typings'],
};

export default config;