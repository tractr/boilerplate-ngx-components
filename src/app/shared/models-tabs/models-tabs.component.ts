import { Component, OnInit } from '@angular/core';
import { routerTransition } from '@app/core';
import { ModelsLinks } from '../models';

@Component({
	selector: 'app-models-tabs',
	templateUrl: './models-tabs.component.html',
	styleUrls: ['./models-tabs.component.scss'],
	animations: [routerTransition]
})
export class ModelsTabsComponent implements OnInit {
	/**
	 * Available models
	 *
	 * @type {[ModelsLinks]}
	 */
	models = ModelsLinks;

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * On Init
	 */
	ngOnInit() {}
}
