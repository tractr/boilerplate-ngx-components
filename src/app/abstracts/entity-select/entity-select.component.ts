import { OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { ErrorService } from '@app/services';
import { Helpers } from '@app/shared';
import { BaseModel, BaseModelInterface } from '@app/abstracts';

export abstract class EntitySelectComponent<
	T extends BaseModel<BaseModelInterface>
> implements OnInit, OnDestroy {
	/** @type {T|T[]} Model to update (can be an array for multiple select) */
	modelValue: T | T[];
	@Output() modelChange = new EventEmitter<T | T[]>();
	@Input()
	get model() {
		return this.modelValue;
	}
	set model(val) {
		this.modelValue = val;
		this.idValue = this.extractIds();
		this.modelChange.emit(this.modelValue);
		this.idChange.emit(this.idValue);
	}

	/** @type {string|string[]} Model id to update (can be an array for multiple select) */
	idValue: string | string[];
	@Output() idChange = new EventEmitter<string | string[]>();
	@Input()
	get id() {
		return this.idValue;
	}
	set id(val) {
		// Get model(s) from API
		const values = val ? (val instanceof Array ? val : [val]) : [];
		Promise.all(values.map(id => this.modelFromId(id)))
			.then((results: T[]) => {
				this.modelValue = this.multiple ? results : results[0];
			})
			.catch(error => this.errorService.handle(error));

		this.idValue = val;
		this.idChange.emit(val);
	}

	/** @type {EventEmitter} Gobal change event */
	@Output() change = new EventEmitter<void>();
	/** @type {EventEmitter} On resfresh starts */
	@Output() updateStart = new EventEmitter<void>();
	/** @type {EventEmitter} On resfresh ends */
	@Output() updateEnd = new EventEmitter<void>();

	/** @type {FormGroup} The parent form group */
	@Input() formGroup;
	/** @type {string} The form control name (if applicable) */
	@Input() controlName: string;
	/** @type {string} The placeholder */
	@Input() placeholder: string;
	/** @type {number} The debuonce delay before calling the API for filtering */
	@Input() filterDebounceTime = 300;
	/** @type {boolean} Denotes if the filter is enabled */
	@Input() filterEnabled = false;
	/** @type {boolean} Denotes the filter should be cleared when closing */
	@Input() clearFilterOnClose = true;
	/** @type {number} Define the limit of items to display in the drop down */
	@Input() resultsLimit = 50;
	/** @type {boolean} Denotes if the instance model is nullable */
	@Input() nullable = false;
	/** @type {string} The label for no results */
	@Input() emptyLabel;
	/** @type {boolean} Denotes if the field should be multiple */
	@Input() multiple = false;
	/** @type {boolean} Denotes if the items should be preloaded */
	@Input() preload = false;
	/** @type {boolean} Force reload items on open */
	@Input() forceReload = false;
	/** @type {boolean} Denotes if the entities can be paginated */
	@Input() paginated = true;

	/** @type {string} Contains the filter value */
	filterValue: string = null;
	/** @type {number} Contains the page number */
	currentPage = 0;
	/** Denotes if the last page has been reached*/
	lastPageReached = false;
	/** @type {Subject<void>} Subject for debounced keyup event */
	protected keyupSubject = new Subject<void>();
	/** @type {T[]} The reason to attend found */
	items: T[] = [];
	/** @type {Subscription[]} Subscription of the component */
	protected subscriptions: Subscription[] = [];
	/** @type {boolean} Denotes if the list has been loaded once */
	loadedOnce = false;
	/** @type {boolean} Denotes if the list is loading */
	loading = false;

	/**
	 * Constructor
	 * @param {ErrorService} errorService
	 */
	constructor(protected errorService: ErrorService) {}

	/** Init */
	ngOnInit() {
		// Subscriptions
		this.subscriptions = [
			this.keyupSubject
				.pipe(debounceTime(this.filterDebounceTime))
				.subscribe(() => {
					this.refresh();
				})
		];
		// Populate on next tick
		setTimeout(() => {
			if (this.preload) {
				this.refresh();
			} else {
				this.prependExisting();
			}
		});
	}
	/** Destroy */
	ngOnDestroy() {
		this.subscriptions.map(s => s.unsubscribe());
	}
	/** Follow on change event */
	onChange() {
		this.change.emit();
	}
	/** Update data when filter changed */
	onFilterChanged(filterValue: string): void {
		if (!this.filterEnabled) {
			return;
		}
		this.filterValue = filterValue;
		this.keyupSubject.next();
	}

	/**
	 * Call when the selector is opened or closed
	 * @param {boolean} opened
	 */
	onOpened(opened: boolean) {
		if (opened) {
			if (!this.loadedOnce || this.forceReload) {
				this.refresh();
			}
		} else if (
			this.filterEnabled &&
			this.clearFilterOnClose &&
			this.filterValue
		) {
			// Clear search if needed
			this.filterValue = null;
			this.refresh();
		}
	}

	/**
	 * Refresh data with filter
	 * @private
	 */
	protected refresh(): void {
		this.lastPageReached = false;
		this.loading = true;
		this.items = [];
		this.updateStart.emit();
		this.currentPage = 0;

		// Get list
		this.getList()
			.then(results => {
				this.prependExisting(results);
			})
			.catch(error => this.errorService.handle(error))
			.then(() => {
				this.updateEnd.emit();
				this.loadedOnce = true;
				this.loading = false;
			});
	}

	/**
	 * Load the next page of results
	 * @private
	 */
	loadMore(): void {
		if (this.lastPageReached || !this.paginated) {
			return;
		}

		this.loading = true;
		this.updateStart.emit();
		this.currentPage++;
		// Get list
		this.getList()
			.then(results => {
				this.prependExisting(results);
				if (results.length === 0) {
					this.lastPageReached = true;
				}
			})
			.catch(error => this.errorService.handle(error))
			.then(() => {
				this.updateEnd.emit();
				this.loading = false;
			});
	}

	/**
	 * Compare two entities
	 * @param e1
	 * @param e2
	 * @return {boolean}
	 */
	compareEntities(e1: any, e2: any): boolean {
		return Helpers.compareEntities(e1, e2);
	}

	/**
	 * Will prepend selected models on top of items list
	 * @param {T[]} list
	 *  Default []
	 */
	protected prependExisting(list: T[] = []) {
		// Remove existing from list and prepend existing
		if (this.multiple) {
			const model = this.model ? <T[]>this.model : [];
			const items = this.items.concat(list).filter(i => {
				return !model.some(e => this.compareEntities(e, i));
			});
			this.items = model.concat(items);
		} else {
			const items = this.items.concat(list).filter(i => {
				return !this.compareEntities(this.model, i);
			});
			this.items = this.model ? [<T>this.model].concat(items) : items;
		}
	}

	/**
	 * Extract id(s) from model(s)
	 * @return {string|string[]}
	 */
	private extractIds(): string | string[] {
		if (this.modelValue instanceof Array) {
			return (<T[]>this.modelValue).map(m => m.getId());
		} else {
			return this.modelValue ? (<T>this.modelValue).getId() : null;
		}
	}

	/**
	 * Find a model from its ids in the items or get it from API
	 * @params {string} id
	 * @return {string|string[]}
	 */
	private async modelFromId(id: string): Promise<T> {
		const loaded = this.items.find(i => this.compareEntities(i, id));
		return loaded ? loaded : await this.getOne(id);
	}

	/**
	 * Crawl values from API
	 * @return {T[]}
	 */
	protected abstract getList(): Promise<T[]>;

	/**
	 * Crawl unique value from API
	 * @params {string} id
	 * @return {T[]}
	 */
	protected abstract getOne(id: string): Promise<T>;
}
