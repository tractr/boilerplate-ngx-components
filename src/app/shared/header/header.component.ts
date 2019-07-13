import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { SessionService, Self } from '@app/services';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { ErrorService } from '@app/services';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
	/** @type {Subject<void>} Observables unsubscriber */
	private unsubscribe: Subject<void> = new Subject<void>();
	/** @type {[{link: string; label: string}]} Header links */
	navigation = [{ link: 'home', label: 'Home' }];
	/** @type {any} Logo */
	logo = require('../../../assets/logos/logo-small-white.svg');
	/** @type {Self} Current User */
	self: Self = null;

	/**
	 * Constructor
	 * @param {SessionService} sessionService
	 * @param {Router} router
	 * @param {ErrorService} errorService
	 */
	constructor(
		private sessionService: SessionService,
		private router: Router,
		private errorService: ErrorService
	) {}

	/**
	 * Init
	 */
	ngOnInit() {
		// Is authenticated
		this.sessionService
			.getSelf()
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(self => {
				this.self = self;
			});
	}

	/**
	 * Destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	/**
	 * Logout
	 */
	logout() {
		this.sessionService
			.logout()
			.then(self => {
				this.router.navigate(environment.logout.redirection);
			})
			.catch(error => this.errorService.handle(error));
	}
}
