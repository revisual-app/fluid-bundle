// context.js
let ENV;

export function init(env) {
	ENV = env;
}

export function getEnv() {
	return ENV;
}
