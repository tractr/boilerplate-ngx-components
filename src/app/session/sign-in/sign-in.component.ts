import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { SessionService } from '@app/services';
import { Router } from '@angular/router';
import { ErrorService } from '@app/services';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
	/** Email input */
	email: string;
	/** Password input */
	password: string;

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

	/** On init */
	ngOnInit() {}

	/** Called when the user click on sign in */
	onSignIn() {
		this.sessionService
			.login(this.email, this.password)
			.then(self => {
				this.router.navigate(environment.login.redirection);
			})
			.catch(error => this.errorService.handle(error));
	}
}
