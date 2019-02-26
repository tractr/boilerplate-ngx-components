import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { TranslateModuleLoad } from '@app/translate-import';

import { StaticRoutingModule } from './static-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
	imports: [SharedModule, StaticRoutingModule, TranslateModuleLoad()],
	declarations: [HomeComponent]
})
export class StaticModule {}
