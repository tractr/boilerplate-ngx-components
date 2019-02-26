import { Subject } from 'rxjs/Subject';

export interface BaseModelInterface {
	_id?: string;
}

export abstract class BaseModel<T extends BaseModelInterface> extends Subject<
	void
> {
	/** Store model properties */
	props: T = <T>{};
	/**
	 * Constructor
	 * @param {T} object
	 *  Optional, object to parse
	 */
	constructor(object: T = null) {
		super();
		if (object !== null) {
			this.fromObject(object);
		}
	}

	/** @return {string} Short function to get id */
	getId(): string {
		return this.props._id;
	}
	/** @return {string} Short function to get label of instance */
	abstract getLabel(): string;
	/** @return {boolean} Denotes if the instance has been created or already exists in the API */
	isNew(): boolean {
		return !this.getId();
	}
	/** @return {boolean} Denotes if the instance has been populated */
	exists(): boolean {
		return !!this.props && typeof this.getId() !== 'undefined';
	}
	/**
	 * Populate the current instance from an object
	 * @param {T} object
	 */
	abstract fromObject(object: T): void;
	/**
	 * Convert the current instance to an object
	 * @return {T}
	 */
	abstract toObject(): T;
	/**
	 * Convert an instance to an object to be sent to the API
	 * @return {T}
	 */
	abstract toPayload(): T;
}
