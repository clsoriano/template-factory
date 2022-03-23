import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress/progress.component';
import { ModuleControlInterface, ComponentControlInterface } from '../../models';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    ProgressComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule
  ]
})
export class ProgressModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return ProgressComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}

}