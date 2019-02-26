export const environment = {
	production: false,
  appName: 'Ngx Components',
	login: {
		redirection: ['']
	},
	logout: {
		redirection: ['session', 'sign-in']
	},
	api: {
		uri: 'http://localhost:3000'
	}
};
