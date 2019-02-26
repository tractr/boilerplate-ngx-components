import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Self } from './self';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ErrorService } from '@app/services/error.service';

export interface SelfResponse {
	_id?: string;
	// @context user:unified-names
	name?: string;
	// @context user:separate-names
	// first_name?: string;
	// last_name?: string;
	role?: string;
}

@Injectable()
export class SessionService {
	/** @type {string} Route for session */
	private _sessionUri = `${environment.api.uri}/session`;
	/** @type {string} Route for password login */
	private _passwordUri = `${environment.api.uri}/password/login`;
	/** @type {Self|null} Store self user instance */
	private _self: Self = null;
	/**@type {ReplaySubject<Self>} Subject for Self */
	private _selfSubject: ReplaySubject<Self> = new ReplaySubject(1);
	/** @type {Observable<Self>} Observable for Self */
	private _selfObservable: Observable<
		Self
	> = this._selfSubject.asObservable();
	/** @type {boolean} Flag to denote if current has been called once */
	private _currentCalled = false;

	/**
	 * Constructor
	 * @param {HttpClient} http
	 * @param {ErrorService} errorService
	 */
	constructor(private http: HttpClient, private errorService: ErrorService) {
		// Call API to get info about current user
		this.current();
	}

	/**
	 * Retrieve user info from api
	 * @return {Promise<void>}
	 */
	async current(): Promise<void> {
		// Get current from api
		const options = { withCredentials: true };
		const result: SelfResponse = await this.http
			.get(this._sessionUri, options)
			.toPromise()
			.catch((e: HttpErrorResponse) => {
				if (e.status !== 401) {
					this.errorService.handle(e);
				}
				return null;
			});
		// Update user from results
		this._self = result !== null ? new Self(result) : null;
		this._selfSubject.next(this._self);
		this._currentCalled = true;
	}

	/**
	 * Resolves when the current has been called once
	 * @return {Promise<void>}
	 */
	private async waitCurrent(): Promise<void> {
		if (this._currentCalled) {
			return;
		}
		await new Promise(resolve => {
			setTimeout(() => resolve(this.waitCurrent()), 10);
		});
	}

	/**
	 * Process a login
	 * @param {string} email
	 * @param {string} password
	 * @return {Promise<Self>}
	 */
	async login(email: string, password: string): Promise<Self> {
		// Do login
		const body = {
			email,
			password
		};
		const options = { withCredentials: true };
		const result: SelfResponse = await this.http
			.post(this._passwordUri, body, options)
			.toPromise();
		// Create user from results
		this._self = new Self(result);
		this._selfSubject.next(this._self);
		return this._self;
	}

	/**
	 * Logout current user
	 * @return {Promise<void>}
	 */
	async logout(): Promise<void> {
		// Get current from api
		const options = { withCredentials: true };
		await this.http
			.delete(this._sessionUri, options)
			.toPromise()
			.catch((e: HttpErrorResponse) =>
				e.status === 401 ? null : Promise.reject(e)
			);
		// Remove user
		this._self = null;
		this._selfSubject.next(this._self);
	}

	/**
	 * Get self observable
	 * @return {Observable<Self>}
	 */
	getSelf(): Observable<Self> {
		return this._selfObservable;
	}

	/**
	 * Denotes if the user is connected
	 * @return {Promise<boolean>}
	 */
	async loggedIn(): Promise<boolean> {
		await this.waitCurrent();
		return this._self !== null;
	}

	/**
	 * Denotes if the user is an admin
	 * @return {Promise<boolean>}
	 */
	async isAdmin(): Promise<boolean> {
		if (await this.loggedIn()) {
			return this._self.isAdmin();
		}
		return false;
	}
}
