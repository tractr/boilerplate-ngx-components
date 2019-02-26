import { URLSearchParams } from '@angular/http';

export class Helpers {
	/**
	 * Convert the current instance to an url query string
	 *
	 * @return {object} object
	 * @return {string}
	 * @static
	 */
	static toQueryString(object): string {
		const search = new URLSearchParams();
		Object.keys(object).map(k => {
			search.set(k, object[k]);
		});
		return search.toString();
	}

	/**
	 * Convert any value to a boolean
	 *
	 * @param {any} value
	 * @return {boolean}
	 * @static
	 */
	static convertToBoolean(value: any) {
		if (typeof value === 'string') {
			return value.toLowerCase() === 'true' || value === '1';
		}
		if (typeof value === 'number') {
			return !!value;
		}
		if (typeof value === 'boolean') {
			return value;
		}

		return false;
	}

	/**
	 * Convert a date to a timestamp (if possible)
	 *
	 * @param {any} value
	 * @return {number}
	 * @static
	 */
	static convertToTimestamp(value: any) {
		if (value instanceof Date) {
			return value.getTime();
		}

		return value;
	}

	/**
	 * Convert any value to a date object (if possible)
	 *
	 * @param {any} value
	 * @return {Date|null}
	 * @static
	 */
	static convertToDate(value: any) {
		if (typeof value === 'string' && !isNaN(Number(value))) {
			return new Date(Number(value));
		}
		if (typeof value === 'number') {
			return new Date(Number(value));
		}

		return null;
	}

	/**
	 * Filter properties of an object to be sent to the API
	 *
	 * @param {any} input
	 * @param {any} output
	 * @return {function}
	 * @static
	 */
	static prepareObjectForApi(input: any, output: any) {
		return (key: string) => {
			// Remove objects, undefined and null
			if (typeof input[key] === 'undefined' || input[key] === null) {
				return;
			}
			// Remove empty strings
			if (typeof input[key] === 'string' && input[key].length === 0) {
				return;
			}
			// Remove empty array
			if (input[key] instanceof Array && input[key].length === 0) {
				return;
			}
			// Transform date to timestamp
			if (input[key] instanceof Date) {
				output[key] = input[key].getTime();
				return;
			}
			// Append value
			output[key] = input[key];
		};
	}

	/**
	 * Compare two entities
	 *
	 * @param e1
	 * @param e2
	 * @return {boolean}
	 */
	static compareEntities(e1: any, e2: any): boolean {
		if (e1 === null && e2 === null) {
			return true;
		}
		if (typeof e1 === 'undefined' || typeof e2 === 'undefined') {
			return false;
		}
		const id1 =
			typeof e1 === 'object' &&
			e1 !== null &&
			typeof e1.getId === 'function'
				? e1.getId()
				: e1;
		const id2 =
			typeof e2 === 'object' &&
			e2 !== null &&
			typeof e2.getId === 'function'
				? e2.getId()
				: e2;
		return id1 === id2;
	}
}
