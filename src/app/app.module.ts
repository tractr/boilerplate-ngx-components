import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { StaticModule } from '@app/static';
import { SessionModule } from '@app/session';
import { ModelsModule } from '@app/models';
import { IsAdminGuard, IsLoggedGuard, IsNotLoggedGuard } from '@app/guards';
import { ErrorService, SessionService } from '@app/services';

import { AppComponent } from './app.component';
import { HeaderComponent, FooterComponent } from './shared/';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModuleLoad } from './translate-import';
import { HttpClientModule } from '@angular/common/http';
import { MetaModule } from '@ngx-meta/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
	declarations: [AppComponent, FooterComponent, HeaderComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		SharedModule,
		StaticModule,
		SessionModule,
		ModelsModule,
		ServiceWorkerModule.register('/ngsw-worker.js', {
			enabled: environment.production
		}),
		NgbModule.forRoot(),
		HttpClientModule,
		AppRoutingModule,
		TranslateModuleLoad(),
		MetaModule.forRoot(),
		MatButtonModule,
		MatIconModule
	],
	providers: [
		IsAdminGuard,
		IsLoggedGuard,
		IsNotLoggedGuard,
		SessionService,
		ErrorService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
