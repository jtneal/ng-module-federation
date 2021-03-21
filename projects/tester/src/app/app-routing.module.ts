import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createMicroFrontendDynamicRoute } from 'projects/library/src/public-api';

import { microFrontends } from '../micro-frontends';

const routes: Routes = [
  ...Object.keys(microFrontends).map((m) => createMicroFrontendDynamicRoute(microFrontends[m])),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
