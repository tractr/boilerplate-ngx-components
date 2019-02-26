import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { SessionService } from '@app/services';
import { environment } from '@env/environment';

@Injectable()
export class IsNotLoggedGuard implements CanActivate {
	constructor(
		private _sessionService: SessionService,
		private _router: Router
	) {}

	async canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean> {
		if (await this._sessionService.loggedIn()) {
			this._router.navigate(environment.login.redirection);
			return false;
		} else {
			return true;
		}
	}
}
