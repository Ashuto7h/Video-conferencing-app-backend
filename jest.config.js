module.exports = {
    collectCoverageFrom: ['src/**/*.(t|j)s', '!src/core/logger/*', '!src/config/*'],
    coverageDirectory: './coverage',
    logHeapUsage: true,
    maxWorkers: 2,
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testEnvironment: 'node',
    testRegex: '.*\\.(test|spec)\\.ts$',
    transform: {
        '^.+\\.(t|j)s?$': ['@swc/jest'],
    },
};
