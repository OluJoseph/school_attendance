module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
	  '^.+\\.(ts|tsx)?$': 'ts-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
	setupFilesAfterEnv: ['@testing-library/react'],
	moduleNameMapper: {
	  '\\.(css|less)$': 'identity-obj-proxy',
	},
  };
  