/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
};

// export default {
// 	clearMocks: true,
// 	coverageProvider: v8,
// 	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
// 	roots: ['<rootDir>/src'],

// 	testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

// 	transform: {
// 		'^.+\\.(ts|tsx)$': 'ts-jest',
// 	},
// };