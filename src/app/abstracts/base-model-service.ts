import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import {
	BaseModel,
	BaseModelInterface,
	BaseModelSearchParamsInterface
} from '@app/abstracts';

/** Interface for listings result */
interface BaseModelSearchResultInterface<T> {
	page: number;
	limit: number;
	count: number;
	total: number;
	items: T[];
}
/** Interface for count results */
interface BaseModelCountResultInterface {
	total: number;
}

@Injectable()
export abstract class BaseModelService<
	T extends BaseModel<BaseModelInterface>,
	I extends BaseModelInterface,
	S extends BaseModelSearchParamsInterface
> {
	/** Removes credentials on read action to allow shared caching */
	protected publicRead = false;
	/** Removes credentials on list action to allow shared caching */
	protected publicList = false;
	/** Removes credentials on count action to allow shared caching */
	protected publicCount = false;
	/** @param {HttpClient} http Constructor */
	constructor(private http: HttpClient) {}

	/**
	 * Create a new model
	 * @param {I} payload
	 * @return {Promise<T>}
	 */
	create(payload: I): Promise<T> {
		// Start request
		const options = { withCredentials: true };
		return this.http
			.post(`${this.uri()}`, payload, options)
			.toPromise()
			.then((result: I) => this.new(result));
	}
	/**
	 * Update an model selected from it's id
	 * @param {string} id
	 * @param {I} payload
	 * @return {Promise<any>}
	 */
	update(id: string, payload: I): Promise<any> {
		// Start request
		const options = { withCredentials: true };
		return this.http
			.patch(`${this.uri()}/${id}`, payload, options)
			.toPromise();
	}
	/**
	 * Get an model from it's id
	 * @param {string} id
	 * @return {Promise<T>}
	 */
	get(id: string): Promise<T> {
		// Start request
		const options = { withCredentials: !this.publicRead };
		return this.http
			.get(`${this.uri()}/${id}`, options)
			.toPromise()
			.then((result: I) => this.new(result));
	}
	/**
	 * Delete an model selected from it's id
	 * @param {string} id
	 * @return {Promise<any>}
	 */
	remove(id: string): Promise<any> {
		// Start request
		const options = { withCredentials: true };
		return this.http.delete(`${this.uri()}/${id}`, options).toPromise();
	}
	/**
	 * Get list for model search
	 * @param {S} searchParams
	 * @return {Promise<BaseModelSearchResultInterface<T>>}
	 */
	list(searchParams: S): Promise<BaseModelSearchResultInterface<T>> {
		// Start request
		const options = {
			withCredentials: !this.publicList,
      params: this.transformSearchParams(searchParams) as {}
		};
		return this.http
			.get(`${this.uri()}`, options)
			.toPromise()
			.then((result: BaseModelSearchResultInterface<I>) => {
				// Create list from results
				return {
					page: result.page,
					limit: result.limit,
					count: result.count,
					total: result.total,
					items: result.items.map((item): T => this.new(item))
				};
			});
	}
	/**
	 * Count for model
	 * @param {S} searchParams
	 * @return {Promise<number>}
	 */
	count(searchParams: S): Promise<number> {
		// Remove unwanted properties
		const params = Object.assign(
			{},
			this.transformSearchParams(searchParams)
		);
		delete params._page;
		delete params._limit;
		delete params._order;
		delete params._sort;
		// Start request
		const options = {
			withCredentials: !this.publicCount,
			params: params as {}
		};
		return this.http
			.get(`${this.uri()}/count`, options)
			.toPromise()
			.then((result: BaseModelCountResultInterface) => result.total);
	}
	/**
	 * Returns the base URI for this model
	 * @return {string}
	 */
	protected uri(): string {
		return `${environment.api.uri}/${this.path()}`;
	}

	/**
	 * Transform search params before search & count
	 * @param {S} searchParams
	 * @return {S}
	 */
	protected transformSearchParams(searchParams: S): S {
		return searchParams;
	}

	/**
	 * Returns the base URI for this model
	 * @return {string}
	 */
	protected abstract path(): string;
	/**
	 * Create a new instance for this payload
	 * @return {string}
	 */
	protected abstract new(object: I): T;
}
