import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { TranslateModuleLoad } from '@app/translate-import';

import { SessionRoutingModule } from './session-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SessionComponent } from './session/session.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		SessionRoutingModule,
		TranslateModuleLoad()
	],
	declarations: [SignInComponent, SessionComponent],
	providers: []
})
export class SessionModule {}
