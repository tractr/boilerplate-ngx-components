import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorService {
	/** @type {number} Display duration*/
	duration = 2000;

	/**
	 * Constructor
	 * @param {TranslateService} translateService
	 * @param {MatSnackBar} snackBar
	 */
	constructor(
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {}

	/**
	 * Handle an error
	 * @param {Error} error
	 */
	handle(error: Error): void {
		if (error instanceof HttpErrorResponse) {
			this._handleHttp(error);
		} else {
			this._show(error.message);
		}
	}

	/**
	 * Handle an http error
	 * @param {HttpErrorResponse} error
	 * @private
	 */
	private _handleHttp(error: HttpErrorResponse): void {
		// Create message
		const message =
			error.error && error.error.error && error.error.message
				? `${error.error.error}: ${error.error.message}`
				: error.message;
		// Show message
		this._show(message);
	}

	/**
	 * Show the snackbar with the message
	 * @param {string} message
	 * @private
	 */
	private _show(message: string): void {
		this.translateService.get('error_dismiss-action').subscribe(text => {
			this.snackBar.open(message, text, {
				duration: this.duration
			});
		});
	}
}
