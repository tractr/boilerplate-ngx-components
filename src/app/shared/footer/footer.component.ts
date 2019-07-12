import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
	/**
	 * Current year
	 *
	 * @type {number}
	 */
	year = new Date().getFullYear();

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Init
	 */
	ngOnInit() {}
}
