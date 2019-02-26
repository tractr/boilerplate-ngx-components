import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
	MatButtonModule,
	MatToolbarModule,
	MatSelectModule,
	MatTabsModule,
	MatInputModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatChipsModule,
	MatCardModule,
	MatSidenavModule,
	MatCheckboxModule,
	MatListModule,
	MatMenuModule,
	MatIconModule,
	MatTooltipModule,
	MatSnackBarModule,
	MatSlideToggleModule,
	MatSliderModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ModelsTabsComponent } from './models-tabs/models-tabs.component';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,

		MatButtonModule,
		MatToolbarModule,
		MatSelectModule,
		MatTabsModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatChipsModule,
		MatCardModule,
		MatSidenavModule,
		MatCheckboxModule,
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		DragDropModule,
		Nl2BrPipeModule,
		EditorModule
	],
	declarations: [ModelsTabsComponent],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		MatButtonModule,
		MatMenuModule,
		MatTabsModule,
		MatChipsModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatCheckboxModule,
		MatCardModule,
		MatSidenavModule,
		MatListModule,
		MatSelectModule,
		MatToolbarModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		DragDropModule,
		Nl2BrPipeModule,
		EditorModule,

		ModelsTabsComponent
	]
})
export class SharedModule {}
