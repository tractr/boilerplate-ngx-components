import { OnInit, Input, OnDestroy } from '@angular/core';
import { BaseModel, BaseModelInterface } from '../base-model';
import { EntitySelectComponent } from '../entity-select/entity-select.component';

export abstract class EntityCheckboxComponent<
	T extends BaseModel<BaseModelInterface>
> extends EntitySelectComponent<T> implements OnInit, OnDestroy {
	/** @inheritDoc */
	@Input() resultsLimit = 12;
	/** @type {number} Denotes the maximum number of selectable elements (only for multiple). 0 => Unlimited */
	@Input() maxSelectable = 0;

	/** @inheritDoc */
	ngOnInit() {
		// Populate on next tick
		setTimeout(() => {
			this.refresh();
		});
	}

	/**
	 * Called when the user click on an item in the list
	 * @param {T} item
	 */
	onClick(item: T) {
		// Un-select an item
		let value;
		if (this.isSelected(item)) {
			if (this.multiple) {
				value = (<T[]>this.model || []).filter(
					i => !this.compareEntities(i, item)
				);
			} else {
				// In case of a single value, set null only if nullable
				if (this.nullable) {
					value = null;
				}
			}
		} else {
			if (this.multiple) {
				value = (<T[]>this.model || []).concat([item]);
				// Remove firsts elements if to long
				if (this.maxSelectable) {
					const length = value.length;
					if (this.maxSelectable < length) {
						value = value.slice(length - this.maxSelectable);
					}
				}
			} else {
				value = item;
			}
		}
		// Set the value only if a new value has been defined
		if (typeof value !== 'undefined') {
			this.model = value;
		}
		// Update form group
		if (this.formGroup && this.controlName) {
			const formControl = this.formGroup.controls[this.controlName];
			formControl.setValue(this.modelValue);
		}
		// Trigger event
		this.change.emit();
	}

	/**
	 * Denotes if the item is selected or not
	 * @param {T} item
	 * @return {boolean}
	 */
	isSelected(item: T): boolean {
		if (this.multiple) {
			for (const i of <T[]>this.model || []) {
				if (this.compareEntities(i, item)) {
					return true;
				}
			}
			return false;
		} else {
			return this.compareEntities(this.model, item);
		}
	}
	/**
	 * @inheritDoc
	 * Bypass this functionality.
	 */
	protected prependExisting(list: T[] = []) {
		this.items = this.items.concat(list);
	}
}
