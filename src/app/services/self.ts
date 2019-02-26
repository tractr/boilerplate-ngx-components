import { SelfResponse } from './session.service';

export class Self {
	/** @private Properties */
	private props: SelfResponse;

	/**
	 * Constructor
	 * @param {SelfResponse} self
	 */
	constructor(self: SelfResponse) {
		this.props = self;
	}

	/**
	 * Returns primary key
	 * @return {string}
	 */
	getId() {
		return this.props._id;
	}

	/**
	 * Returns role
	 * @return {string}
	 */
	getRole() {
		return this.props.role;
	}

	/**
	 * Returns display name
	 * @return {string}
	 */
	getName() {
		// @context user:unified-names
		return `${this.props.name}`;
		// @context user:separate-names
		// return `${this.props.first_name} ${this.props.last_name}`;
	}

	/**
	 * Returns role
	 * @return {boolean}
	 */
	isAdmin() {
		return this.props.role === 'admin';
	}
}
