import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class ErrorService {
	/**
	 * Constructor
	 * @param message
	 */
	constructor(private message: NzMessageService) {}

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
		this.message.create('error', message);
	}
}
