import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { createMicroFrontendRoutes } from 'ng-module-federation';

import { microFrontends } from '../micro-frontends';
import { AppComponent } from './app.component';

const routes: Routes = createMicroFrontendRoutes(microFrontends);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
