module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['/src/setupTests.ts'], // Pointing to your setup file
};
