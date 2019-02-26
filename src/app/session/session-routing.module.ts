import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { SessionComponent } from './session/session.component';

const routes: Routes = [
	{
		path: 'session',
		component: SessionComponent,
		children: [
			{
				path: '',
				redirectTo: 'sign-in',
				pathMatch: 'full'
			},
			{
				path: 'sign-in',
				component: SignInComponent,
				data: {
					title: 'Sign In'
				}
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SessionRoutingModule {}
