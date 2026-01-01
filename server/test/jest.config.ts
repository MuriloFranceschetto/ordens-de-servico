import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "../src",
    testRegex: ".*\\.spec\\.ts$",
    testPathIgnorePatterns: [
        '/node_modules./',
        '/(coverage|dist|lib|tmp)./*',
    ],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    silent: false,
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
    },
};

export default config;