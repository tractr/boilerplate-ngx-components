import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { IsLoggedGuard } from '@app/guards';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		data: { title: 'Home' },
		canActivate: [IsLoggedGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StaticRoutingModule {}
