import { OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
	BaseModel,
	BaseModelInterface,
	BaseModelSearchParams,
	BaseModelSearchParamsInterface
} from '@app/abstracts';

interface SortInfo {
	key: string;
	value: 'descend' | 'ascend' | null;
}

export abstract class EntityTableComponent<
	T extends BaseModel<BaseModelInterface>,
	S extends BaseModelSearchParams<BaseModelSearchParamsInterface>
> implements OnInit, OnDestroy {
	/** @type {S} The search params */
	@Input() searchParams: S;
	/** @type {number} Delay to show loading spinner. Avoid blinking effect on fast APIs */
	@Input() refreshingDelay = 200;
	/** @type {EventEmitter} Triggered when the user select a row */
	@Output() select = new EventEmitter<T>();
	/** @type {boolean} Raised if the list in being updated */
	refreshing = true;
	/** @type {Subscription[]} Subscription to the tables events */
	private _subscriptions: Subscription[] = [];
	/** Object containing results */
	items: T[] = [];
	/** @type {number} Length of the received results */
	total = 0;
	/** @type {number} Index of the displayed page (starts at 1) */
	pageIndex = 1;

	/**
   * Constructor
   constructor() {
  }
   /** Init */
	ngOnInit() {
		// Subscriptions
		this._subscriptions = [
			this.searchParams.subscribe(() => {
				this.pageIndex = Number(this.searchParams.props._page) + 1;
				this.refresh();
			})
		];
	}

	/** Destroy */
	ngOnDestroy() {
		this._subscriptions.map(s => s.unsubscribe());
	}

	/**
	 * On select
	 * @param {T} item
	 */
	onClick(item: T) {
		this.select.emit(item);
	}

	/**
	 * Update data
	 */
	update(resetPage = false): void {
		// Set page number
		this.searchParams.props._page = resetPage ? 0 : this.pageIndex - 1;
		// Trigger update
		this.searchParams.next();
	}

	/**
	 * Sort data
	 */
	sort(info: SortInfo): void {
		// Remove sorting
		if (info.value === null) {
			delete this.searchParams.props._sort;
			delete this.searchParams.props._order;
		}
		// Apply sorting
		else {
			this.searchParams.props._sort = info.key;
			this.searchParams.props._order =
				info.value === 'ascend' ? 'asc' : 'desc';
		}
		// Trigger update
		this.searchParams.next();
	}

	/**
	 * Refresh data from search params
	 * @private
	 */
	protected abstract refresh(): void;
}
