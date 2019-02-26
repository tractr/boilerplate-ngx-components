import { Subject } from 'rxjs/Subject';

/** Used to export and import search params */
export interface BaseModelSearchParamsInterface {
	_page?: string | number;
	_limit?: string | number;
	_sort?: string;
	_order?: string;
}

/** Manage model search params */
export abstract class BaseModelSearchParams<
	T extends BaseModelSearchParamsInterface
> extends Subject<void> {
	/** @type {T} Stores the properties of the instance */
	props: T;
	/** @type {number} Default page number */
	defaultPage = 0;
	/** @type {number} Default page length */
	defaultLimit = 10;

	/**
	 * Constructor
	 * @param {T} object
	 *  Optional, object to parse
	 */
	constructor(object: T = <T>{}) {
		super();
		this.fromObject(object);
	}

	/**
	 * Populate the instance from an object (extracted from query string)
	 * @param {T} input
	 */
	abstract fromObject(input: T): void;
	/**
	 * Convert the instance to an object readable for the API and storable in the query string
	 * @return {T}
	 */
	abstract toObject(): T;
	/**
	 * List allowed keys for the interface
	 * @return {string[]}
	 */
	protected allowedKeys(): string[] {
		return ['_page', '_limit', '_sort', '_order'];
	}
}
