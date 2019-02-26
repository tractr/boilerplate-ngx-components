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
export class IsAdminGuard implements CanActivate {
	constructor(
		private _sessionService: SessionService,
		private _router: Router
	) {}

	async canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean> {
		if (await this._sessionService.isAdmin()) {
			return true;
		} else {
			this._router.navigate(environment.logout.redirection);
			return false;
		}
	}
}
