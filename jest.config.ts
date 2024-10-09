module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};