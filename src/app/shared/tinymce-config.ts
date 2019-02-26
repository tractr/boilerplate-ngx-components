/*
 * Load the tinymce module config
 */
/**
 * A method to returns tinymce configs
 *
 * @param custom
 * @return {{}}
 */
export const TinyMceConfig = (custom = {}) => {
	const def = {
		tinymceScriptURL: 'assets/tinymce/tinymce.min.js',
		baseURL: '',
		skin_url: '/assets/tinymce/skins/lightgray',
		theme_url: '/assets/tinymce/themes/modern/theme.min.js',
		branding: false,
		height: 300,
		external_plugins: {
			link: '/assets/tinymce/plugins/link/plugin.js',
			paste: '/assets/tinymce/plugins/paste/plugin.js'
		},
		plugins: ['link', 'paste'],
		menubar: false,
		style_formats: [
			{ title: 'Title', block: 'h2' },
			{ title: 'Paragraph', block: 'p' }
		],
		toolbar:
			'undo redo | copy paste cut removeformat | styleselect | heading2 bold italic underline | link',
		valid_elements: 'a[href|target|title],strong/b,u,i/em,p,h2'
	};

	return Object.assign({}, def, custom);
};
