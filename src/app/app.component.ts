import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators/filter';
import { ModelsLinks } from '@app/shared';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
	/** CSS */
	@HostBinding('class') componentCssClass;
	/** @type {Subject<void>} Observables unsubscriber*/
	private unsubscribe: Subject<void> = new Subject<void>();
	/** @type {ModelLink[]} Side links*/
	navigationSideMenu = ModelsLinks;
	/** @type {string[]} Routes where the footer should be displayed  */
	private routesFooter: string[] = ['', 'home'];
	/** @type {string[]} Routes where the footer should be displayed  */
	private routesNoHeader: string[] = ['session'];
	/** @type {boolean} */
	displayFooter = false;
	/** @type {boolean} */
	displayHeader = false;
	/** @type {string} */
	appName = environment.appName;

	/**
	 * Constructor
	 * @param {Router} router
	 * @param {Title} titleService
	 * @param {TranslateService} translate
	 */
	constructor(
		private router: Router,
		private titleService: Title,
		private translate: TranslateService
	) {
		// Define the list of available languages. Avoid 404 on missing languages
		translate.addLangs(['en']);
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang('en');
		// the lang to use, if the lang isn't available, it will use the current loader to get them
		const allowedLang = translate
			.getLangs()
			.find(l => l === translate.getBrowserLang());
		translate.use(
			localStorage.getItem('lang') ||
				allowedLang ||
				translate.getDefaultLang()
		);
	}

	/** Init */
	ngOnInit() {
		// Animation on navigation
		this.router.events
			.pipe(filter(event => event instanceof ActivationEnd))
			.subscribe((event: ActivationEnd) => {
				let lastChild = event.snapshot;
				while (lastChild.children.length) {
					lastChild = lastChild.children[0];
				}
				const { title } = lastChild.data;
				this.titleService.setTitle(
					title ? `${title} - ${this.appName}` : this.appName
				);
				// Show footer
				const url = event.snapshot.url.toString();
				this.displayFooter = this.routesFooter.some(r => r === url);
				this.displayHeader = !this.routesNoHeader.some(r => r === url);
			});
	}

	/** Destroy */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
