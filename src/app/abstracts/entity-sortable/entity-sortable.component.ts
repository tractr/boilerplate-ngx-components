import { OnInit, Input, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BaseModel, BaseModelInterface } from '../base-model';
import { EntitySelectComponent } from '../entity-select/entity-select.component';

export abstract class EntitySortableComponent<
	T extends BaseModel<BaseModelInterface>
> extends EntitySelectComponent<T> implements OnInit, OnDestroy {
	/** @type {boolean} Denotes if the values must be unique */
	@Input() unique = true;
	/** @type {number} Denotes the maximum number of selectable elements (only for multiple). 0 => Unlimited */
	@Input() maxSelectable = 0;
	/** @type {T} Pending selected value*/
	selectedValue: T;

	/**
	 * Called when drop ends
	 * @param {CdkDragDrop<string[]>} event
	 */
	onDrop(event: CdkDragDrop<string[]>) {
		moveItemInArray(
			<T[]>this.model || [],
			event.previousIndex,
			event.currentIndex
		);
		this.afterChange();
	}
	/** Follow on change event */
	onChange() {
		// Create model if necessary
		if (!(this.model instanceof Array)) {
			this.model = [];
		}
		// Push if not selected yet or if accept duplicates
		const cannotPush =
			(this.unique &&
				this.model.some(i =>
					this.compareEntities(i, this.selectedValue)
				)) ||
			this.maxReached();
		if (!cannotPush) {
			this.model.push(this.selectedValue);
			this.afterChange();
		}
		// Remove value on next tick
		setTimeout(() => {
			this.selectedValue = null;
		});
	}
	/** Called when the user click on delete */
	onDelete(index: number) {
		// Push if not selected yet
		(<T[]>this.model || []).splice(index, 1);
		this.afterChange();
	}
	/**
	 * @inheritDoc
	 * Bypass this functionality.
	 */
	protected prependExisting(list: T[] = []) {
		this.items = this.items.concat(list);
	}
	/** Denotes if some models are selected */
	hasModels(): boolean {
		return this.model && (<T[]>this.model).length > 0;
	}
	/** Denotes if the max number of selectable elements is reached */
	maxReached(): boolean {
		return (
			this.maxSelectable > 0 &&
			this.model &&
			(<T[]>this.model).length >= this.maxSelectable
		);
	}
	/** Common process after something changed */
	afterChange() {
		// Force update to update ids
		this.model = this.modelValue;
		// Update form group
		if (this.formGroup && this.controlName) {
			const formControl = this.formGroup.controls[this.controlName];
			formControl.setValue(this.modelValue);
		}
		// Trigger event
		this.change.emit();
	}
}
