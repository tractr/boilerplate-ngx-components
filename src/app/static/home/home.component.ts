import { Component, OnInit } from '@angular/core';
import { ModelsHomeLinks } from '@app/shared';
import { routerTransition } from '@app/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [routerTransition]
})
export class HomeComponent implements OnInit {
	/** @type {ModelLink[]} Home links*/
	models = ModelsHomeLinks;

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Init
	 */
	ngOnInit() {}
}
