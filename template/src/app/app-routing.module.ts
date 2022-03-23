import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineBuilderComponent } from './main/engine-builder/engine-builder.component';


const routes: Routes = [
  {
    path: 'embedded/:path',
    component: EngineBuilderComponent
  },
  {
    path: 'ui/:path',
    component: EngineBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
