import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionModule } from '@app/session';
import { ModelsModule } from '@app/models';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'session',
		loadChildren: () => SessionModule
	},
	{
		path: '',
		loadChildren: () => ModelsModule
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	declarations: []
})
export class AppRoutingModule {}
